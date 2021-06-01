#!/usr/bin/env node

const fs = require('fs/promises')
const path = require('path')
const mkdirp = require('mkdirp')

const directory = path.join(__dirname, '..', 'migrations')
const time = Date.now()
const migration = process.argv[2]

if (migration === undefined) {
  console.error('a migration name must be given')
  process.exit(1)
}

;(async () => {
  const fpath = path.join(directory, `${time}_${migration}.sql`)

  await mkdirp(directory)
  await fs.writeFile(fpath, '-- WRITE SOME SQL\n')

  console.log(`created ${path.relative(process.cwd(), fpath)}`)
})()
