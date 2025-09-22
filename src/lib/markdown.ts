import TurndownService from "turndown"
import fs from "fs"
import path from 'path'

const rootPath = process.cwd()
const markdownPath = path.join(rootPath, "markdown")

export const htmlToMarkdown = (html: string, fileName: string): void => {
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(html);
  fs.writeFileSync(path.join(markdownPath, fileName), markdown, "utf8")
}