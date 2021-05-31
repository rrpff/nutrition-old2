import path from 'path'
import { singular } from 'pluralize'
import capitalize from 'capitalize'
import { green, yellow, grey } from 'chalk'
import { parseDescription, readCSV } from './lib/utils'
import { IUsdaNutrients, IUsdaFoodNutrients, IUsdaFoodCsv, IUsdaFoodCategory, IUsdaFoodRecord, INutrientProfile } from './types'

const SR_LEGACY_DIRECTORY_PATH = path.join(__dirname, '..', 'data', 'FoodData_Central_sr_legacy_food_csv_ 2019-04-02')
const SUPPORTING_DIRECTORY_PATH = path.join(__dirname, '..', 'data', 'FoodData_Central_Supporting_Data_csv_2021-04-28')

const foodDataPath = path.join(SR_LEGACY_DIRECTORY_PATH, 'food.csv')
const foodCategoryPath = path.join(SUPPORTING_DIRECTORY_PATH, 'food_category.csv')
const foodNutrientPath = path.join(SR_LEGACY_DIRECTORY_PATH, 'food_nutrient.csv')
const nutrientPath = path.join(SUPPORTING_DIRECTORY_PATH, 'nutrient.csv')

const queryRegexp = new RegExp(process.argv[2] || '.*', 'g')

const getNutrients = (fdcId: string, nutrients: IUsdaNutrients[], foodNutrients: IUsdaFoodNutrients[]): INutrientProfile => {
  return foodNutrients
    .filter(n => n.fdc_id === fdcId)
    .reduce((acc, n) => {
      const usdaNutrient = nutrients.find(u => u.id === n.nutrient_id)
      return {
        ...acc,
        [usdaNutrient!.id]: {
          amount: n.amount,
          unit: usdaNutrient!.unit_name,
        }
      }
    }, {} as any)
}

const parseFoods = async (): Promise<IUsdaFoodRecord[]> => {
  const foods = await readCSV<IUsdaFoodCsv>(foodDataPath)
  const categories = await readCSV<IUsdaFoodCategory>(foodCategoryPath)
  // const foodNutrients = await readCSV<IUsdaFoodNutrients>(foodNutrientPath)
  // const usdaNutrients = await readCSV<IUsdaNutrients>(nutrientPath)

  return foods.map(food => {
    const { name, notes, modifiers } = parseDescription(food.description)
    // const nutrients = getNutrients(food.fdc_id, usdaNutrients, foodNutrients)
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
const withoutIgnoredModifiers = (food: IUsdaFoodRecord): IUsdaFoodRecord => ({
  ...food,
  modifiers: food.modifiers.filter(mod => !IGNORED_MODIFIERS.includes(mod)),
})

const withoutBrandedFoods = (food: IUsdaFoodRecord) => {
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

  // Just weird honestly
  'Beverages, carbonated, low calorie, cola or pepper-type, with aspartame, contains caffeine',
  'Beverages, carbonated, low calorie, cola or pepper-type, with aspartame, without caffeine',
  'Beverages, carbonated, low calorie, cola or pepper-types, with sodium saccharin, contains caffeine',
  'Beverages, carbonated, low calorie, other than cola or pepper,  without caffeine',
  'Beverages, carbonated, low calorie, other than cola or pepper, with aspartame, contains caffeine',
  'Beverages, carbonated, pepper-type, contains caffeine',
  'Carbonated beverage, low calorie, other than cola or pepper, with sodium saccharin, without caffeine',
]
const withoutUnwantedFoods = (food: IUsdaFoodRecord) => {
  return !UNWANTED_FOODS.includes(food.originalUsdaDescription)
}

const withSpecificFixes = (food: IUsdaFoodRecord) => {
  switch (food.originalUsdaDescription) {
    case 'Alcoholic beverage, rice (sake)':
      return { ...food, name: 'Sake', modifiers: [], notes: [] }

    case 'Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 94 proof':
      return { ...food, name: 'Distilled alcohol', modifiers: ['94 proof'], notes: [] }

    case 'Alcoholic beverage, distilled, all (gin, rum, vodka, whiskey) 100 proof':
      return { ...food, name: 'Distilled alcohol', modifiers: ['100 proof'], notes: [] }

    case 'Beverages, carbonated, orange':
      return { ...food, name: 'Orange drink', modifiers: ['carbonated'], notes: [] }

    default:
      return food
  }
}

const withRemovedPrefixes = (food: IUsdaFoodRecord) => {
  const fix = (updated: IUsdaFoodRecord) => {
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

const withAppendedPrefixes = (food: IUsdaFoodRecord) => {
  const fix = (updated: IUsdaFoodRecord) => {
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

;(async () => {
  const foods = await parseFoods()

  foods
    .filter(food => queryRegexp.test(food.originalUsdaDescription))
    .filter(withoutBrandedFoods)
    .filter(withoutUnwantedFoods)
    .map(withoutIgnoredModifiers)
    .map(withSpecificFixes)
    .map(withRemovedPrefixes)
    .map(withAppendedPrefixes)
    .map(food => {
      console.log(yellow([green(food.name), ...food.modifiers].join(', ')))
      console.log(grey(`> USDA: ${food.originalUsdaDescription}`))

      Object.keys(food.nutrients).forEach(nutrient => {
        console.log(grey(`> ${nutrient} ${(food.nutrients as any)[nutrient].amount} ${(food.nutrients as any)[nutrient].unit}`))
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
