// @ts-ignore
import { foods as outputFoods } from '../output/index.json'
import { IOutputFood } from './types'

export * from './types'
export const foods = outputFoods as IOutputFood[]
