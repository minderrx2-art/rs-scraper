import * as cheerio from 'cheerio'
import axios from 'axios'
import { store, get } from '../model/cache.ts'
import { saveFile, fileExists } from '../model/storage.ts'
import { warn, info, error } from './logger.ts'

const NEWS_ARTICLE_IDENTIFIER = 'a.readMore.news-list-article__read-more'
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
]

const DELAY = 2000
const DELAY_LONG = 180000 // 3 min

// minWait is in seconds
const DELAY_VARIABILITY = (minWait: number) => {
  return (Math.floor(Math.random() * 10) * 1000 * minWait)
}

/**
 * @param url URL of website to scrape
 * @returns HTML string promise
 */
export const getHTML = async (url: string): Promise<string> => {
  try {
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": `${userAgent}`,
        "Accept": "text/html,application/xhtml+xml",
      },
    })
    const $ = cheerio.load(data)
    return $.html()
  } catch (error) {
    warn('1', 'Failed to fetch for URL', url)
    throw error
  }
}

/**
 * @param html HTML string
 * @returns News article URL or nothing
 */
export const getArticleHrefs = (html: string): string[] | undefined => {
  const $ = cheerio.load(html)
  const hrefs = $(NEWS_ARTICLE_IDENTIFIER)
    .map((_, e) => $(e).attr('href'))
    .get()
  if (hrefs.length > 0) {
    return hrefs
  }
}

/**
 * Generates an array of archive urls 
 * @returns string[]
 */
export const getUrls = (): string[] => {
  const startYear = 2013
  const today = new Date()
  const endYear = today.getFullYear()
  const endMonth = today.getMonth() + 1
  const urls = []
  for (let year = startYear; year <= endYear; year++) {
    const maxMonth = (year === endYear) ? endMonth : 12
    for (let month = 1; month <= maxMonth; month++) {
      urls.push(`https://secure.runescape.com/m=news/archive?oldschool=1&year=${year}&month=${month}`)
    }
  }
  return urls
}
/**
 * Wraps around scrapping and will keep retrying if a request is denied after waiting for a set delay
 * @param fn callback
 * @param args URL to scrape
 * @param retries number of attempts
 * @returns 
 */
export const getHTMLWrapper = async <T>(fn: Function, args: string[], retries: number = 3): Promise<T> => {
  for (let i = 1; i < retries; i++) {
    try {
      return await fn(...args)
    }
    catch (err) {
      info('1', 'Putting to sleep for', (DELAY_LONG * i) / 1000)
      await sleep(DELAY_LONG * i)
    }
  }
  throw new Error(`[FATAL] All retries failed for url ${args}`)
}

const sleep = async (delay: number) => {
  await new Promise(res => setTimeout(res, delay + DELAY_VARIABILITY(5)))
}

/**
 * Checks cache for last scraped URL and returns it
 */
const reduceUrls = async (archiveUrls: string[]) => {
  const lastScrapedEnv = process.env.LAST_SCRAPED_URL
  const cachedUrl = await get('archive_url')
  const index = archiveUrls.findIndex((url) => (url === cachedUrl || url === lastScrapedEnv))
  return index > -1 ? archiveUrls.slice(index) : archiveUrls
}

/**
 * Extracts dev blog name
 * @param link 
 * @returns 
 */
const generateFileName = (link: string) => {
  const match = link.match(/m=news\/([^?]+)/) ?? []
  return `${match[1]?.replaceAll('-', '_')}.html`
}

/**
 * Main scraping logic goes through dev blogs one by one and saves them
 * @returns Promise resolves when done scraping
 */
export const scrape = async () => {
  const archiveUrls = getUrls()
  const urlsToScrape = await reduceUrls(archiveUrls)
  for (let url of urlsToScrape) {
    await store('archive_url', url)
    const archiveHTML = await getHTMLWrapper<string>(getHTML, [url])
    const links = await getArticleHrefs(archiveHTML)

    if (!links) continue

    for (const link of links) {
      const fileName = generateFileName(link)
      if (await fileExists(fileName)) {
        continue
      }
      try {
        const devdiaryHTML = await getHTMLWrapper<string>(getHTML, [link])
        await saveFile(fileName, devdiaryHTML)
        info('Wrote file', fileName)
        await sleep(DELAY)
      } catch (e) {
        error('Failed 3 retries, skipping', link)
        continue
      }
    }
  }
  return Promise.resolve()
}