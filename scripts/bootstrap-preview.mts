// One-time setup for an isolated, empty Neon preview database.
// Never execute against production. Use Payload's development-mode schema push.
if (process.env.VERCEL_ENV !== 'preview' || process.env.VERCEL_GIT_COMMIT_REF !== 'feat/neon-payload-stitch') {
  throw new Error('Schema bootstrap is restricted to the EK Collection preview branch')
}
if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) throw new Error('Preview DATABASE_URI and PAYLOAD_SECRET are required')
process.env.NODE_ENV = 'development'
process.env.PAYLOAD_DB_PUSH = 'true'
const { default: config } = await import('../src/payload.config.ts')
const { getPayload } = await import('payload')
const payload = await getPayload({ config })
payload.logger.info('Preview Payload schema initialized')
process.exit(0)
