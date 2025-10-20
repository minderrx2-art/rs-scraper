import { start } from './server.ts'
import { scrape } from './lib/scrape.ts'
import { info } from './lib/logger.ts'

async function main() {
  if (process.env.RUN_SCRAPER === 'true') {
    info('Scraping website')
    await scrape()
    info('Scraping finished')
    process.exit(0)
  } else {
    info('Running server')
    await start()
  }
}

// Only run if called via 'node src/index.ts'
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main }
