// Work around Payload's @next/env default-import interop bug in the build container.
// Upstream issue: payloadcms/payload#16674. Does not touch application data.
const fs = require('node:fs')
const file = require('node:path').join(process.cwd(), 'node_modules/payload/dist/bin/loadEnv.js')
let source = fs.readFileSync(file, 'utf8')
if (source.includes("import nextEnvImport from '@next/env'")) {
  source = source.replace("import nextEnvImport from '@next/env'", "import * as nextEnvImport from '@next/env'")
  source = source.replace('const { loadEnvConfig } = nextEnvImport;', 'const { loadEnvConfig } = nextEnvImport.default ?? nextEnvImport;')
  fs.writeFileSync(file, source)
  console.log('Applied Payload @next/env interop workaround')
} else if (!source.includes('nextEnvImport.default ?? nextEnvImport')) {
  throw new Error('Payload loadEnv format changed; refusing unsafe patch')
}
