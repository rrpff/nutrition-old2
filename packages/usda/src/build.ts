import path from 'path'
import { singular } from 'pluralize'
import capitalize from 'capitalize'
import { green, yellow, grey } from 'chalk'
import { readCSV, sum } from './lib/utils'
import { IUsdaFoodNutrients, IUsdaFoodCsv, IUsdaFoodCategory, IUsdaFoodVariant, INutrientProfile, IUsdaFood, IUsdaToCoreNutrientMapping } from './types'
import { INutrientKey } from '@nutrition/core'

const DATA_DIRECTORY_PATH = path.join(__dirname, '..', 'data')
const SR_LEGACY_DIRECTORY_PATH = path.join(DATA_DIRECTORY_PATH, 'FoodData_Central_sr_legacy_food_csv_ 2019-04-02')
const SUPPORTING_DIRECTORY_PATH = path.join(DATA_DIRECTORY_PATH, 'FoodData_Central_Supporting_Data_csv_2021-04-28')

const foodDataPath = path.join(SR_LEGACY_DIRECTORY_PATH, 'food.csv')
const foodCategoryPath = path.join(SUPPORTING_DIRECTORY_PATH, 'food_category.csv')
const foodNutrientPath = path.join(SR_LEGACY_DIRECTORY_PATH, 'food_nutrient.csv')
const nutrientMappingPath = path.join(DATA_DIRECTORY_PATH, 'nutrient_mapping.csv')

const queryRegexp = new RegExp(process.argv[2] || '.*', 'g')

const NOTES_REGEXP = /\(([^\)]*)\)/g

const parseDescription = (description: string) => {
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

const getFoodVariants = async (foods: IUsdaFoodCsv[], categories: IUsdaFoodCategory[]): Promise<IUsdaFoodVariant[]> => {
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

const IGNORED_MODIFIERS = [
  'all commercial varieties',
  'all varieties',
  'all types',
  'commercially prepared',
  'flesh and skin',
  'raw',
  'sulfured',
  'uncooked',
  'unprepared',
  'year round average',
  'Latino bakery item',
  'salt added in processing',
  'salt not added in processing',
  'as purchased',
  'composite of cuts',
  'composite of trimmed retail cuts',
  'separable fat',
  'rack - partly frenched',
  'regular',
  'prepared-from-recipe',
  'prepared with water',
  'all',
  'ready-to-drink',
  'extruded',
  'plain',
  'regular flavor',
  'made with partially hydrogenated oil',
  'with calcium propionate',
  'with ca prop',
]
const withoutIgnoredModifiers = (food: IUsdaFoodVariant): IUsdaFoodVariant => ({
  ...food,
  modifiers: food.modifiers.filter(mod => !IGNORED_MODIFIERS.includes(mod)),
})

const withoutBrandedFoods = (food: IUsdaFoodVariant) => {
  return ![
    /[A-Z]{2,}/g, // Only branded foods seem to be capitalised like this
    /^Restaurant,/,
    /Archway Home Style Cookies/,
    /Continental Mills/,
    /George Weston Bakeries/,
    /Hormel Pillow Pak/,
    /Kraft Foods/,
    /Mckee Baking/,
    /Monster/,
    /Pepperidge Farm/,
    /Pillsbury/,
    /Propel Zero/,
    /Rudi's/,
    /Udi's/,
    /Van's/,
    /Nabisco/,
    /Mission Foods/,
    /Martha White Foods/,
    /Kraft/,
    /Mary's Gone Crackers/,
    /Clif Z/,
    /Andrea's/,
  ].some(regexp => {
    return regexp.test(food.originalUsdaDescription)
  })
}

const UNWANTED_FOODS = [
  // Duplicated, sort of
  'Beverages, rich chocolate, powder',
  'Snacks, corn-based, extruded, chips, barbecue-flavor',
  'Snacks, corn-based, extruded, chips, plain',
  'Snacks, corn-based, extruded, cones, plain',

  // Highly specific, not useful
  'School Lunch, pizza, cheese topping, thick crust, whole grain, frozen, cooked',
  'School Lunch, pizza, pepperoni topping, thick crust, whole grain, frozen, cooked',
  'School Lunch, pizza, cheese topping, thin crust, whole grain, frozen, cooked',
  'School Lunch, chicken patty, whole grain breaded',

  // Just weird honestly
  'Beverages, carbonated, low calorie, cola or pepper-type, with aspartame, contains caffeine',
  'Beverages, carbonated, low calorie, cola or pepper-type, with aspartame, without caffeine',
  'Beverages, carbonated, low calorie, cola or pepper-types, with sodium saccharin, contains caffeine',
  'Beverages, carbonated, low calorie, other than cola or pepper,  without caffeine',
  'Beverages, carbonated, low calorie, other than cola or pepper, with aspartame, contains caffeine',
  'Beverages, carbonated, pepper-type, contains caffeine',
  'Carbonated beverage, low calorie, other than cola or pepper, with sodium saccharin, without caffeine',

  // Should probably be more specific than this eh
  'Nutritional supplement for people with diabetes, liquid',
]
const withoutUnwantedFoods = (food: IUsdaFoodVariant) => {
  return !UNWANTED_FOODS.includes(food.originalUsdaDescription)
}

const withSpecificFixes = (food: IUsdaFoodVariant) => {
  switch (food.originalUsdaDescription) {
    case 'Alcoholic beverage, rice (sake)':
      return { ...food, name: 'Sake', modifiers: [], notes: [] }

    case 'Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 80 proof':
      return { ...food, name: 'Distilled alcohol', modifiers: ['80 proof'], notes: [] }

    case 'Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 86 proof':
      return { ...food, name: 'Distilled alcohol', modifiers: ['86 proof'], notes: [] }

    case 'Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 94 proof':
      return { ...food, name: 'Distilled alcohol', modifiers: ['94 proof'], notes: [] }

    case 'Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 100 proof':
      return { ...food, name: 'Distilled alcohol', modifiers: ['100 proof'], notes: [] }

    case 'Beverages, carbonated, orange':
      return { ...food, name: 'Orange drink', modifiers: ['carbonated'], notes: [] }

    case 'Beverages, Energy Drink with carbonated water and high fructose corn syrup':
      return { ...food, name: 'Energy drink', modifiers: [], notes: [] }

    default:
      return food
  }
}

const withRemovedPrefixes = (food: IUsdaFoodVariant) => {
  const fix = (updated: IUsdaFoodVariant) => {
    const isPrefixed = [
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
    ].some(regexp => {
      return regexp.test(updated.name)
    })

    if (!isPrefixed) return updated

    const [realName, ...realModifiers] = updated.modifiers

    return {
      ...updated,
      name: capitalize(realName),
      modifiers: [...realModifiers, singular(updated.name.toLowerCase())],
    }
  }

  // Some prefixes are nested, e.g.:
  //   'Fast Food, Pizza chain, 14 inch pizza, regular crust'
  // This applies the prefix removal repeatedly until there are no
  // more prefixes to remove, ending up with a result like:
  //   '14 inch pizza, regular crust, fast food, pizza chain'
  return applyUntilStatic(food, fix, food => food.name)
}

const withAppendedPrefixes = (food: IUsdaFoodVariant) => {
  const fix = (updated: IUsdaFoodVariant) => {
    const isPrefixed = [
      /^Beans$/,
    ].some(regexp => {
      return regexp.test(updated.name)
    })

    if (!isPrefixed) return updated

    const [realName, ...realModifiers] = updated.modifiers

    return {
      ...updated,
      name: capitalize([realName, food.name].join(' ')),
      modifiers: [...realModifiers],
    }
  }

  return applyUntilStatic(food, fix, food => food.name)
}

const groupVariantsIntoFoods = (foods: IUsdaFood[], variant: IUsdaFoodVariant) => {
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
}

const getNutrientsForFoodVariantId = (fdcId: string, usdaNutrientsForFood: IUsdaFoodNutrients[], mappings: IUsdaToCoreNutrientMapping[]): INutrientProfile => {
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

const withNutrients = (
  food: IUsdaFoodVariant,
  usdaFoodNutrients: IUsdaFoodNutrients[],
  mappings: IUsdaToCoreNutrientMapping[],
): IUsdaFoodVariant => {
  return {
    ...food,
    nutrients: getNutrientsForFoodVariantId(food.sourceId, usdaFoodNutrients, mappings),
  }
}

;(async () => {
  const usdaFoods = await readCSV<IUsdaFoodCsv>(foodDataPath)
  const usdaCategories = await readCSV<IUsdaFoodCategory>(foodCategoryPath)
  const foodNutrients = await readCSV<IUsdaFoodNutrients>(foodNutrientPath)
  const mappings = await readCSV<IUsdaToCoreNutrientMapping>(nutrientMappingPath)

  const foods = await getFoodVariants(usdaFoods, usdaCategories)

  foods
    .filter(food => queryRegexp.test(food.originalUsdaDescription))
    .filter(withoutBrandedFoods)
    .filter(withoutUnwantedFoods)
    .map(withoutIgnoredModifiers)
    .map(withSpecificFixes)
    .map(withRemovedPrefixes)
    .map(withAppendedPrefixes)
    .map(food => withNutrients(food, foodNutrients, mappings))
    .reduce(groupVariantsIntoFoods, [] as IUsdaFood[])
    .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
    .map(food => {
      console.log(green(food.name) + ' ' + yellow(food.variants.length))
      food.variants.map(variant => {
        console.log(grey(`+ ${[variant.name, ...variant.modifiers].join(', ')}`))
        console.log(grey(`  (originally "${variant.originalUsdaDescription}")`))

        Object.keys(variant.nutrients).forEach(nutrient => {
          console.log(grey(`>   ${nutrient} ${variant.nutrients[nutrient as INutrientKey].amount} ${variant.nutrients[nutrient as INutrientKey].unit}`))
        })
      })
    })
})()

function applyUntilStatic<T>(base: T, mapper: (elem: T) => T, iteratee: (a: T) => any): T {
  let previous: T = base
  let current: T = base
  let iterations: number = 0

  while (iterations === 0 || iteratee(current) !== iteratee(previous)) {
    previous = current
    current = mapper(previous)
    iterations += 1
  }

  return current
}
