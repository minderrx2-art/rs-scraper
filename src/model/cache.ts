import redis from 'redis';

const client = redis.createClient({
  url: 'redis://redis:6379' // 'redis' is the Docker service name
});

export const store = async (key: string, value: string | number): Promise<void> => {
  await client.set(key, value)

  const replay = await client.get(key);

  if (!replay) {
    throw new Error('[FATAL] Redis failed to store a value')
  }

  console.log(`[INFO] Value stored: ${replay}`)
}

export const get = async (key: string): Promise<string | null> => {
  return await client.get(key)
}

await client.connect()