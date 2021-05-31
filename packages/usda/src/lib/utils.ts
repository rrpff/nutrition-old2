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

export const uniq = <T>(acc: T[], elem: T): T[] => {
  if (acc.includes(elem)) return acc
  return [...acc, elem]
}

export const flatten = <T>(arr: T[][]): T[] => {
  return arr.reduce((acc, subarr) => {
    return [...acc, ...subarr]
  }, [])
}

export const sum = (arr: number[]): number => arr.reduce((total, n) => total + n, 0)
