const hq = require('alias-hq')

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleNameMapper: hq.get('jest'),
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest'
  },
}
