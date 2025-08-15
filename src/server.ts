import Fastify from 'fastify'
import { pool } from './db.ts'
import { getHTML, getArticleHrefs } from './scrape.ts'

const fastify = Fastify({
  logger: true
})

// BRO POWERSHELL IS SO GARBAGE I NEED TO SET UP LINUX VIRTUAL ENVIRONMENT AND GET ZSH
// Queries URL given in [line 12] and extracts all article links [line 14]
// Then extracts the HTML of those articles [line 20]
fastify.get('/', async (request, reply) => {
  const URL = 'https://secure.runescape.com/m=news/archive?oldschool=1&year=2025&month=8'
  const html = await getHTML(URL)
  const links = await getArticleHrefs(html)
  if (!links) return { response: 'NO LINKS FOUND' }
  for (const link of links) {
    const delay = 2000 + (Math.floor(Math.random() * 5) * 1000)
    await new Promise(res => setTimeout(res, delay))
    const html2 = await getHTML(link);
    console.log(`[${delay}ms delay] result ->`, html2)
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
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