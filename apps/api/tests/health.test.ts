import Fastify from 'fastify'
import { healthRoutes } from '../src/routes/health.js'
import request from 'supertest'

describe('health', () => {
  it('returns ok', async () => {
    const app = Fastify()
    await app.register(healthRoutes, { prefix: '/v1' })
    await app.ready()

    const res = await request(app.server).get('/v1/health')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)

    await app.close()
  })
})
