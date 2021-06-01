import capitalize from 'capitalize'
import { singular } from 'pluralize'
import { IUsdaFoodCsv, IUsdaFoodCategory, IUsdaFoodVariant, INutrientProfile, IUsdaFoodNutrients, IUsdaToCoreNutrientMapping, IUsdaFood } from '../types'
import { applyUntilStatic, sum } from './utils'

const IGNORED_PREFIXES = [
  /^Alcoholic [b|B]everages?/,
  /^Beverages?/,
  /^Carbonated/,
  /^Distilled$/,
  /^Fast [f|F]oods?$/,
  /^Leavening agents?/,
  /^Pizza chain$/,
  /^Reduced sugar/,
  /^Seeds$/,
  /^Snacks?/,
]

const IGNORED_MODIFIERS = [
  /^all commercial varieties$/,
  /^all varieties$/,
  /^all types$/,
  /^commercially prepared$/,
  /^flesh and skin$/,
  /^raw$/,
  /^sulfured$/,
  /^uncooked$/,
  /^unprepared$/,
  /^year round average$/,
  /^Latino bakery item$/,
  /^salt added in processing$/,
  /^salt not added in processing$/,
  /^as purchased$/,
  /^composite of cuts$/,
  /^composite of trimmed retail cuts$/,
  /^separable fat$/,
  /^rack - partly frenched$/,
  /^regular$/,
  /^prepared-from-recipe$/,
  /^prepared with water$/,
  /^all$/,
  /^ready-to-drink$/,
  /^extruded$/,
  /^plain$/,
  /^regular flavor$/,
  /^made with partially hydrogenated oil$/,
  /^with calcium propionate$/,
  /^with ca prop$/,
]

const PREFIXES_TO_APPEND = [
  /^Beans$/,
  /^Nuts$/,
  /^Oil$/,
  /^Spices$/,
  /^Syrups$/,
]

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

export const parseFoodVariants = async (foods: IUsdaFoodCsv[], categories: IUsdaFoodCategory[]): Promise<IUsdaFoodVariant[]> => {
  return foods.map(food => {
    const { name, notes, modifiers } = parseDescription(food.description)
    const nutrients = {} as any
    const category = {
      name: categories.find(c => c.id === food.food_category_id)!.description
    }

    return {
      sourceId: food.fdc_id,
      originalUsdaDescription: food.description,
      name,
      notes,
      modifiers,
      nutrients,
      category,
    }
  })
}

export const removeIgnoredPrefixes = (food: IUsdaFoodVariant) => {
  const fix = (current: IUsdaFoodVariant) => {
    const isPrefixed = [...IGNORED_PREFIXES].some(regexp => {
      return regexp.test(current.name)
    })

    if (!isPrefixed) return current

    const [realName, ...realModifiers] = current.modifiers

    return {
      ...current,
      name: capitalize(realName),
      modifiers: [...realModifiers],
    }
  }

  // Some prefixes are nested, e.g.:
  //   'Fast Food, Pizza chain, 14 inch pizza, regular crust'
  // This applies the prefix removal repeatedly until there are no
  // more prefixes to remove, ending up with a result like:
  //   '14 inch pizza, regular crust, fast food, pizza chain'
  return applyUntilStatic(food, fix, food => food.name)
}

export const removeIgnoredModifiers = (food: IUsdaFoodVariant): IUsdaFoodVariant => ({
  ...food,
  modifiers: food.modifiers.filter(mod => ![...IGNORED_MODIFIERS].some(regexp => regexp.test(mod))),
})

export const appendUnwantedPrefixes = (food: IUsdaFoodVariant) => {
  const fix = (updated: IUsdaFoodVariant) => {
    const isPrefixed = [...PREFIXES_TO_APPEND].some(regexp => {
      return regexp.test(updated.name)
    })

    if (!isPrefixed) return updated

    const [realName, ...realModifiers] = updated.modifiers

    return {
      ...updated,
      name: capitalize(realName),
      modifiers: [...realModifiers],
    }
  }

  return applyUntilStatic(food, fix, food => food.name)
}

export const applyNutrients = (
  food: IUsdaFoodVariant,
  usdaFoodNutrients: IUsdaFoodNutrients[],
  mappings: IUsdaToCoreNutrientMapping[],
): IUsdaFoodVariant => {
  return {
    ...food,
    nutrients: getNutrientsForFoodVariantId(food.sourceId, usdaFoodNutrients, mappings),
  }
}

export const getNutrientsForFoodVariantId = (fdcId: string, usdaNutrientsForFood: IUsdaFoodNutrients[], mappings: IUsdaToCoreNutrientMapping[]): INutrientProfile => {
  const variantNutrients = usdaNutrientsForFood.filter(n => n.fdc_id === fdcId)

  return mappings.reduce((profile, mapping) => {
    const usdaIds = mapping.usda_ids.split('+')
    const amount = sum(usdaIds.map(usdaId => {
      const found = variantNutrients.find(n => n.nutrient_id === usdaId)?.amount
      return found ? Number(found) : 0
    }))

    return {
      ...profile,
      [mapping.nutrient_key]: {
        amount: amount,
        unit: mapping.unit_key,
      }
    }
  }, {} as INutrientProfile)
}

export const groupVariantsIntoFoods = (variants: IUsdaFoodVariant[]) => {
  return variants.reduce((foods: IUsdaFood[], variant: IUsdaFoodVariant) => {
    const existingFoodIndex = foods.findIndex(food => food.name === variant.name)
    const exists = existingFoodIndex > -1

    if (!exists) return [...foods, { name: variant.name, variants: [variant] }]

    const existingFood = foods[existingFoodIndex]
    return [
      ...foods.filter((_, index) => index !== existingFoodIndex),
      {
        name: variant.name,
        variants: [
          ...existingFood.variants,
          variant
        ]
      }
    ]
  }, [])
}
