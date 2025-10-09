import { describe, it, expect, vi } from 'vitest'
import { main } from '../src/index.js'

vi.mock('../src/lib/scrape.js', () => ({
  scrape: vi.fn()
}))

vi.mock('../src/server.js', () => ({
  start: vi.fn()
}))

describe('main', () => {
  it('runs scraper when env=true', async () => {
    process.env.RUN_SCRAPER = 'true'
    await main()
    const { scrape } = await import('../src/lib/scrape.js')
    expect(scrape).toHaveBeenCalled()
  })

    it('runs server when env=false', async () => {
    process.env.RUN_SCRAPER = 'false'
    await main()
    const { start } = await import('../src/server.ts')
    expect(start).toHaveBeenCalled()
  })
})
