import fs from 'fs/promises'
import path from 'path'
import { IOutputFood } from './types'

const OUTPUT_DIR = path.join(__dirname, '..', 'output')
const OUTPUT_JSON_PATH = path.join(OUTPUT_DIR, 'index.json')

const output = require(OUTPUT_JSON_PATH)
output.foods = output.foods.sort((a: IOutputFood, b: IOutputFood) => {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
})

fs.writeFile(OUTPUT_JSON_PATH, JSON.stringify(output, null, 2))
