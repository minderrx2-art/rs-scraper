import Fastify from 'fastify'
import { info } from './lib/logger.ts'

const fastify = Fastify({
  logger: true
})

fastify.get('/', async (req, res) => {
  res.send({ status: 'TEMP' })
})

export const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    info("Server running")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}