const redis = require('redis');

const client = redis.createClient({
    url: 'redis://redis:6379' // 'redis' is the Docker service name
});

async function main() {
    await client.connect();

    console.log('Connected to Redis!');

    await client.set('myKey', 'Hello from Docker Redis!');
    const value = await client.get('myKey');
    console.log('myKey:', value);

    await client.disconnect();
}

main().catch(console.error);