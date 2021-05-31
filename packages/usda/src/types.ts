import { INutrientKey, IUnitKey } from '@nutrition/core'

export interface IUsdaFoodCsv {
  fdc_id: string
  data_type: 'sr_legacy_food'
  description: string
  food_category_id: string
  publication_date: string
}

export interface IUsdaFoodCategory {
  id: string
  code: string
  description: string
}

export interface IUsdaFoodNutrients {
  fdc_id: string
  nutrient_id: string
  amount: string
}

export interface IUsdaNutrients {
  id: string
  name: string
  unit_name: string
}

export interface IUsdaToCoreNutrientMapping {
  usda_ids: string
  name: string
  nutrient_key: INutrientKey
  unit_key: IUnitKey
}

export type INutrientProfile = {
  [K in INutrientKey]: {
    amount: number
    unit: IUnitKey
  }
}

export interface IUsdaFoodRecord {
  sourceId: string
  name: string
  originalUsdaDescription: string
  notes: string[]
  modifiers: string[]
  nutrients: INutrientProfile
  category: {
    name: string
  }
}
