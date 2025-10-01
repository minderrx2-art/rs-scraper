import * as cheerio from 'cheerio'
import axios from 'axios'
const NEWS_ARTICLE_IDENTIFIER = 'a.readMore.news-list-article__read-more'
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
]
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
    console.error("[ERROR] Failed to fetch Html for: ", url)
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