import redis from 'redis';

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = process.env.REDIS_PORT || '6379';

const client = redis.createClient({
  url: `redis://${redisHost}:${redisPort}`
})

export const store = async (key: string, value: string | number): Promise<void> => {
  await client.set(key, value)

  const reply = await client.get(key)

  if (!reply) {
    throw new Error('[FATAL] Redis failed to store a value')
  }

  console.log(`[CACHE] Value stored: ${reply}`)
}

export const get = async (key: string): Promise<string | null> => {
  return await client.get(key)
}

await client.connect()