import { FastifyPluginAsync } from 'fastify'

export const userRoutes: FastifyPluginAsync = async (app) => {
  app.get('/users/me', { preHandler: app.authenticate }, async (req) => {
    const userId = req.user.sub
    const user = await app.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    })
    return { user }
  })

  app.get('/admin/users', { preHandler: app.authorize(['ADMIN']) }, async () => {
    const users = await app.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    })
    return { users }
  })
}
