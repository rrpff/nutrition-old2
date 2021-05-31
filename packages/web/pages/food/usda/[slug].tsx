import { GetStaticPaths, GetStaticProps } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { foods, IUsdaFood, IUsdaFoodVariant } from '@nutrition/usda'
import { INutrientKey } from '@nutrition/core'
import { Layout } from '@/containers/Layout'

// TODO: move into @nutrition/usda
const foodToSlug = (food: IUsdaFood) => food.name.toLowerCase().replace(/\s/g, '-').replace(/[^0-9|a-z|-]/g, '')
const variantDescription = (variant: IUsdaFoodVariant) => [variant.name, ...variant.modifiers].join(', ')

interface IUsdaFoodPageProps {
  food: IUsdaFood
}

const UsdaFoodPage = ({ food }: IUsdaFoodPageProps) => {
  // TODO: set default in @nutrition/usda
  const [selectedVariant, setSelectedVariant] = useState(
    food.variants.find(v => variantDescription(v) === food.name) || food.variants[0]
  )

  return (
    <Layout>
      <Head>
        <title>Nutrition</title>
      </Head>

      <small><Link href="/food/usda"><a>back</a></Link></small>
      <h1>{food.name}</h1>

      <select onChange={e => setSelectedVariant(food.variants.find(v => v.sourceId === e.target.value)!)}>
        {food.variants
          .sort((a, b) =>
            variantDescription(a) < variantDescription(b) ? -1 :
            variantDescription(a) > variantDescription(b) ? 1 :
            0
          )
          .map(variant => (
            <option key={variant.sourceId} value={variant.sourceId} selected={variant.sourceId === selectedVariant.sourceId}>
              {variantDescription(variant)}
            </option>
          ))
        }
      </select>

      <h2>{variantDescription(selectedVariant)}</h2>
      <p>Original USDA name: {selectedVariant.originalUsdaDescription}</p>

      <table>
        <thead>
          <tr>
            <th>Nutrient</th>
            <th>Value</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(selectedVariant.nutrients).sort().map(name => (
            <tr key={name}>
              <td>{name}</td>
              <td>{selectedVariant.nutrients[name as INutrientKey].amount}</td>
              <td>{selectedVariant.nutrients[name as INutrientKey].unit} per 100g</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = foods.map(foodToSlug)
    .map(slug => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<IUsdaFoodPageProps> = async ({ params }) => {
  const food = foods.find(food => foodToSlug(food) === params!.slug)

  return {
    props: {
      food: food!
    }
  }
}

export default UsdaFoodPage