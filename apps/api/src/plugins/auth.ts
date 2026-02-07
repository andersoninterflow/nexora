import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

export type JwtUser = { sub: string; role: 'USER' | 'ADMIN' }

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: () => Promise<void>
    authorize: (roles: Array<JwtUser['role']>) => () => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: JwtUser
  }
}

export default fp(async (app) => {
  app.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-me'
  })

  app.decorate('authenticate', async function () {
    await this.jwtVerify<JwtUser>()
  })

  app.decorate('authorize', function (roles: Array<JwtUser['role']>) {
    return async () => {
      await app.authenticate()
      if (!roles.includes(app.user.role)) {
        throw app.httpErrors.forbidden('Você não tem permissão para acessar este recurso.')
      }
    }
  })
})
