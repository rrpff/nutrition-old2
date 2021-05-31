import fs from 'fs'
import parse from 'csv-parse'

export const readCSV = async <T>(path: string): Promise<T[]> => {
  const parser = fs.createReadStream(path).pipe(parse({ columns: true }))
  const records = []
  for await (const record of parser) {
    records.push(record)
  }

  return records
}

const NOTES_REGEXP = /\(([^\)]*)\)/g

export const parseDescription = (description: string) => {
  const [name, ...modifiers] = description.replace(NOTES_REGEXP, '').split(/[,|;]\s*/g)
  const notes = description.match(NOTES_REGEXP) || []

  return {
    name: name.trim().replace(/\s{2,}/g, ''),
    notes: Array.from(notes).map(note => note.slice(1, note.length - 1)),
    modifiers: modifiers
      .map(modifier => modifier.trim().replace(/\s{2,}/g, ' '))
      .filter(modifier => modifier.length > 0),
  }
}
