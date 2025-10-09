import { start } from './server.ts'
import { scrape } from './lib/scrape.ts'

async function main() {
  if (process.env.RUN_SCRAPER === 'true') {
    console.log('[INFO] Scraping data')
    await scrape()
  } else {
    console.log('[INFO] Running server')
    await start()
  }
}

// Only run if called via 'node src/index.ts'
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main }
