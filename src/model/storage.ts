import { Storage } from '@google-cloud/storage'

const BUCKET_NAME = 'rs-scraper'
const PROJECT_ID = 'rs-scraper-475008'

const storage = new Storage({
  projectId: PROJECT_ID,
})

export const saveFile = async (fileName: string, content: string): Promise<void> => {
  const file = storage.bucket(BUCKET_NAME).file(`html/${fileName}`)
  await file.save(content, {
    resumable: false,
    contentType: 'text/html'
  })
}

export const fileExists = async (fileName: string): Promise<boolean> => {
  const file = storage.bucket(BUCKET_NAME).file(`html/${fileName}`)
  const  [exists] = await file.exists()
  return exists
}