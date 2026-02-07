import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import argon2 from 'argon2'
import crypto from 'node:crypto'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).optional()
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const refreshSchema = z.object({
  refreshToken: z.string().min(20)
})

function newRefreshToken(): string {
  return crypto.randomBytes(48).toString('base64url')
}

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/auth/register', async (req, res) => {
    const body = registerSchema.parse(req.body)

    const existing = await app.prisma.user.findUnique({ where: { email: body.email } })
    if (existing) return res.conflict('E-mail já cadastrado.')

    const passwordHash = await argon2.hash(body.password)
    const user = await app.prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        passwordHash
      },
      select: { id: true, email: true, name: true, role: true }
    })

    return res.code(201).send({ user })
  })

  app.post('/auth/login', async (req, res) => {
    const body = loginSchema.parse(req.body)

    const user = await app.prisma.user.findUnique({ where: { email: body.email } })
    if (!user) return res.unauthorized('Credenciais inválidas.')

    const ok = await argon2.verify(user.passwordHash, body.password)
    if (!ok) return res.unauthorized('Credenciais inválidas.')

    const accessToken = await app.jwt.sign({ sub: user.id, role: user.role }, { expiresIn: '15m' })

    const refreshToken = newRefreshToken()
    const tokenHash = await argon2.hash(refreshToken)
    await app.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      }
    })

    return res.send({
      accessToken,
      refreshToken
    })
  })

  app.post('/auth/refresh', async (req, res) => {
    const { refreshToken } = refreshSchema.parse(req.body)

    const candidates = await app.prisma.refreshToken.findMany({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true }
    })

    // Busca por comparação de hash (simples e segura para MVP; em escala, use tokenId + hash)
    const match = await (async () => {
      for (const c of candidates) {
        if (await argon2.verify(c.tokenHash, refreshToken)) return c
      }
      return null
    })()

    if (!match) return res.unauthorized('Refresh token inválido.')

    const accessToken = await app.jwt.sign({ sub: match.userId, role: match.user.role }, { expiresIn: '15m' })
    return res.send({ accessToken })
  })

  app.post('/auth/logout', async (req, res) => {
    const { refreshToken } = refreshSchema.parse(req.body)

    const tokens = await app.prisma.refreshToken.findMany({ where: { revokedAt: null } })

    for (const t of tokens) {
      if (await argon2.verify(t.tokenHash, refreshToken)) {
        await app.prisma.refreshToken.update({ where: { id: t.id }, data: { revokedAt: new Date() } })
        break
      }
    }

    return res.send({ ok: true })
  })
}
