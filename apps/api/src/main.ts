import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import sensible from '@fastify/sensible'

import prismaPlugin from './plugins/prisma.js'
import authPlugin from './plugins/auth.js'
import { healthRoutes } from './routes/health.js'
import { authRoutes } from './routes/auth.js'
import { userRoutes } from './routes/user.js'

const app = Fastify({
  logger: true
})

await app.register(sensible)
await app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? true
})

await app.register(swagger, {
  openapi: {
    info: {
      title: 'NEXORA API',
      version: '0.1.0'
    }
  }
})

await app.register(swaggerUI, {
  routePrefix: '/docs'
})

await app.register(prismaPlugin)
await app.register(authPlugin)

await app.register(healthRoutes, { prefix: '/v1' })
await app.register(authRoutes, { prefix: '/v1' })
await app.register(userRoutes, { prefix: '/v1' })

const port = Number(process.env.PORT ?? 3000)
const host = process.env.HOST ?? '0.0.0.0'

try {
  await app.listen({ port, host })
  app.log.info(`✅ API rodando em http://${host}:${port}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
