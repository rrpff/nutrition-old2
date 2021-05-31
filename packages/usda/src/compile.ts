import fs from 'fs/promises'
import path from 'path'
import mkdirp from 'mkdirp'
import chalk from 'chalk'
import prompts from 'prompts'
import logUpdate from 'log-update'
import { readCSV, uniq } from './lib/utils'
import { IUsdaFoodNutrients, IUsdaFoodCsv, IUsdaFoodCategory, IUsdaFood, IUsdaToCoreNutrientMapping, IOutputFood, IOutputFoodVariant } from './types'
import { appendUnwantedPrefixes, getNutrientsForFoodVariantId, groupVariantsIntoFoods, parseFoodVariants, removeIgnoredModifiers, removeIgnoredPrefixes } from './lib/parser'

interface IJsonOutput {
  foods: IOutputFood[]
}

const DATA_DIRECTORY_PATH = path.join(__dirname, '..', 'data')
const SR_LEGACY_DIRECTORY_PATH = path.join(DATA_DIRECTORY_PATH, 'FoodData_Central_sr_legacy_food_csv_ 2019-04-02')
const SUPPORTING_DIRECTORY_PATH = path.join(DATA_DIRECTORY_PATH, 'FoodData_Central_Supporting_Data_csv_2021-04-28')
const OUTPUT_DIR = path.join(__dirname, '..', 'output')
const OUTPUT_JSON_PATH = path.join(OUTPUT_DIR, 'index.json')

const foodDataPath = path.join(SR_LEGACY_DIRECTORY_PATH, 'food.csv')
const foodCategoryPath = path.join(SUPPORTING_DIRECTORY_PATH, 'food_category.csv')
const foodNutrientPath = path.join(SR_LEGACY_DIRECTORY_PATH, 'food_nutrient.csv')
const nutrientMappingPath = path.join(DATA_DIRECTORY_PATH, 'nutrient_mapping.csv')

const save = async (content: IJsonOutput) => {
  await mkdirp(OUTPUT_DIR)
  await fs.writeFile(OUTPUT_JSON_PATH, JSON.stringify(content, null, 2))
}

const run = async () => {
  const usdaFoods = await readCSV<IUsdaFoodCsv>(foodDataPath)
  const usdaCategories = await readCSV<IUsdaFoodCategory>(foodCategoryPath)
  const foodNutrients = await readCSV<IUsdaFoodNutrients>(foodNutrientPath)
  const mappings = await readCSV<IUsdaToCoreNutrientMapping>(nutrientMappingPath)

  const variants = (await parseFoodVariants(usdaFoods, usdaCategories))
    .map(removeIgnoredModifiers)
    .map(removeIgnoredPrefixes)
    .map(appendUnwantedPrefixes)

  const foods = groupVariantsIntoFoods(variants)

  // const output: IJsonOutput = {
  //   foods: []
  // }

  const output: IJsonOutput = require('../output/index.json')

  const onCancel = () => process.exit(1)

  const startIndex = foods.findIndex(food => food.name === 'Soymilk')
  // console.log(foods[startIndex + 1])
  // console.log(startIndex)
  // foods.slice(0, startIndex + 1).forEach(food => console.log(food.name))
  // process.exit(0)

  for (let food of foods.slice(startIndex)) {
    const keptVariants: IOutputFoodVariant[] = []
    const removedVariantIds: string[] = []
    let keepAll = false

    for (let i = 0; i < food.variants.length; i++) {
      const selectedVariant = food.variants[i]
      const selectedVariantName = [selectedVariant.name, ...selectedVariant.modifiers].join(', ')

      const addSelectedVariantWithName = (name: string) => {
        const nutrients = getNutrientsForFoodVariantId(selectedVariant.sourceId, foodNutrients, mappings)

        keptVariants.push({
          source: 'usda',
          sourceId: selectedVariant.sourceId,
          name: name,
          nutrients: nutrients,
        })
      }

      const variantLines = food.variants.map(lineVariant => {
        const selected = selectedVariant.sourceId === lineVariant.sourceId
        const removed = removedVariantIds.includes(lineVariant.sourceId)
        const renamed = keptVariants.some(v => v.sourceId === lineVariant.sourceId)
        const renamedTo = keptVariants.find(v => v.sourceId === lineVariant.sourceId)?.name

        const variantName = [lineVariant.name, ...lineVariant.modifiers].join(', ')
        const usdaDescription = lineVariant.originalUsdaDescription

        return (
          selected ? `${chalk.yellow(`- ${variantName}`)}\n  Originally: ${chalk.grey(usdaDescription)}\n` :
          removed ? `${chalk.grey(`- ${variantName}`)}\n  Originally: ${chalk.grey(usdaDescription)}\n  Removed: yes` :
          renamed ? `${chalk.grey(`- ${variantName}`)}\n  Originally: ${chalk.grey(usdaDescription)}\n  Removed: no\n  Renamed: ${renamedTo}` :
          `${chalk.grey(`- ${variantName}`)}\n  Originally: ${chalk.grey(usdaDescription)}\n`
        )
      }).join('\n')

      console.clear()
      logUpdate(variantLines)

      if (keepAll) {
        addSelectedVariantWithName(selectedVariantName)
        continue
      }

      const { choice } = await prompts({
        type: 'select',
        name: 'choice',
        message: `Keep ${chalk.italic(selectedVariantName)}? ${chalk.grey(`(${i + 1}/${food.variants.length})`)}`,
        initial: 0,
        choices: [
          { title: 'Skip all', value: 'skip-all' },
          { title: 'Skip', value: 'skip' },
          { title: 'Keep all without renaming', value: 'keep-all' },
          { title: 'Keep', value: 'keep' },
        ]
      }, { onCancel })

      if (choice === 'skip-all') break
      if (choice === 'skip') continue
      if (choice === 'keep-all') {
        keepAll = true
      }

      if (keepAll) {
        addSelectedVariantWithName(selectedVariantName)
        continue
      }

      const { updatedName } = await prompts({
        type: 'text',
        name: 'updatedName',
        message: 'Rename?',
        initial: selectedVariantName,
      }, { onCancel })

      addSelectedVariantWithName(updatedName)
    }

    if (keptVariants.length > 0) {
      const newFoodNames = uniq(keptVariants.map(v => v.name.split(',')[0]))
      newFoodNames.forEach(newFoodName => {
        const newFoodVariants = keptVariants.filter(v => v.name.split(',')[0] === newFoodName)

        output.foods.push({
          name: newFoodName,
          variants: newFoodVariants,
        })
      })


      await save(output)
    }
  }
}

run()
