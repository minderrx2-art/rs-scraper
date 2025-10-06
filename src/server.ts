import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

fastify.get('/', async (req, res) => {
  res.send({ status: 'TEMP' })
})

export const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('[INFO] Server running on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}