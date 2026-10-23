import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Users, Media, Products, Categories, Orders, Customers, Pages } from './collections'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const endpoint = process.env.AWS_ENDPOINT_URL_S3 || process.env.S3_ENDPOINT
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY
const region = process.env.AWS_REGION || process.env.S3_REGION || 'ap-southeast-1'
const bucket = process.env.S3_BUCKET || 'uploads'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  admin: { user: Users.slug, importMap: { baseDir: path.resolve(dirname) } },
  editor: lexicalEditor(),
  collections: [Users, Media, Products, Categories, Orders, Customers, Pages],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '' },
    // Only enable temporarily while setting up a brand new empty database.
    push: process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  plugins: endpoint && accessKeyId && secretAccessKey ? [
    s3Storage({
      collections: {
        media: {
          generateFileURL: ({ filename }) => endpoint.replace(/\/$/, '') + '/' + bucket + '/' + encodeURIComponent(filename),
        },
      },
      bucket,
      config: {
        endpoint, region, forcePathStyle: true,
        credentials: { accessKeyId, secretAccessKey },
      },
    }),
  ] : [],
})
