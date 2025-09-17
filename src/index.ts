import Fastify from 'fastify'
import { getHTML, getArticleHrefs, getUrls } from './scrape.ts'
import { htmlToMarkdown } from './markdown.ts'
// import { getPool } from './db.ts'
import fs from 'fs';
import path from 'path'

const fastify = Fastify({
  logger: true
})

const rootPath = process.cwd()
const filePath = path.join(rootPath, "documents")

const DELAY = 5000
const DELAY_LONG = 120000 // 2 min
const DELAY_VARIABILITY = () => {
  return (Math.floor(Math.random() * 10) * 1000)
}

fastify.get('/', async (req, res) => {
  const archiveUrls = getUrls()
  for (let url of archiveUrls) {

    const archiveHTML = await getHTMLWrapper<string>(getHTML, [url])
    
    // const archiveHTML = await getHTML(url)
    const links = await getArticleHrefs(archiveHTML)

    if (!links) continue

    for (const link of links) {
      const match = link.match(/m=news\/([^?]+)/) ?? []
      const fileName = `${match[1]?.replaceAll('-', '_')}.html`
      try {
        fs.readFileSync(path.join(filePath, fileName))
      } catch (error) {
        const devdiaryHTML = await getHTMLWrapper<string>(getHTML, [link])
        console.log('[INFO] Wrote ', fileName)
        fs.writeFileSync(path.join(filePath, fileName), devdiaryHTML, "utf8")
        await sleep(DELAY)
      }
      continue
    }
  }
})

const getHTMLWrapper = async <T>(fn: Function, args: string[], retries: number = 5): Promise<T> => {
  for (let i = 1; i < retries; i++){
    try {
      return await fn(...args)
    }
    catch(err){
      console.log('[ERROR] Putting to sleep for ' + (DELAY_LONG * i) / 1000)
      await sleep(DELAY_LONG * i)
    }
  }
  throw new Error(`[FATAL] All retries failed for url ${args}`)
}

const sleep = async (delay: number) =>  {
  await new Promise(res => setTimeout(res, delay + DELAY_VARIABILITY()))
}

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0'})
    console.log('Server running on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// Commented out since not doing storage yet
// const storeInDatabase = async () => {
//   const [rows] = await pool.query(
//    'INSERT INTO pages (url, html) VALUES (?, ?)',
//     [URL, rawHTML]);
//   console.log(rows);
// }

start()