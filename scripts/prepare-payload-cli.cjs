// Temporary workaround for a Payload CLI / tsx / undici CacheStorage constructor collision.
// Only run for the isolated preview database bootstrap, never in production.
if (process.env.VERCEL_ENV !== 'preview') throw new Error('Bootstrap is preview-only')
const fs = require('node:fs')
const file = require.resolve('undici/lib/web/cache/cachestorage')
const source = fs.readFileSync(file, 'utf8')
const pattern = /if \(arguments\[0\] !== kConstruct\) \{/g
if (!pattern.test(source)) throw new Error('Undici constructor layout changed; refusing patch')
fs.writeFileSync(file, source.replace(pattern, 'if (false) {'))
console.log('Prepared Payload CLI bootstrap in isolated preview build')
