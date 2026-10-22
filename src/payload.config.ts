import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Users, Media, Products, Categories, Orders, Customers, Pages } from './collections'
const dirname = path.dirname(fileURLToPath(import.meta.url))
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  admin: { user: Users.slug, importMap: { baseDir: path.resolve(dirname) } },
  editor: lexicalEditor(),
  collections: [Users, Media, Products, Categories, Orders, Customers, Pages],
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI || '' } }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  plugins: process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY ? [
    s3Storage({ collections: { media: true }, bucket: process.env.S3_BUCKET || 'ek-collection', config: {
      credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY },
      endpoint: process.env.S3_ENDPOINT, region: process.env.S3_REGION || 'ap-south-1', forcePathStyle: true
    } })
  ] : []
})
