import * as cheerio from 'cheerio'
import axios from 'axios'

const NEWS_ARTICLE_IDENTIFIER = 'a.readMore.news-list-article__read-more'

/**
 * 
 * @param url URL of website to scrape
 * @returns HTML string promise
 */
export const getHTML = async (url: string): Promise<string> => {
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)
  return $.html()
}
/**
 * 
 * @param html HTML string
 * @returns News article URL or nothing
 */
export const getArticleHrefs = (html: string): string[] | undefined => {
  const $ = cheerio.load(html)
  const hrefs = $(NEWS_ARTICLE_IDENTIFIER)
  .map((i, e) => $(e).attr('href'))
  .get()
  if (hrefs.length > 0) {
    return hrefs
  }
}