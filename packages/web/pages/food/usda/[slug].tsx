import { GetStaticPaths, GetStaticProps } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { foods, IOutputFood, IOutputFoodVariant } from '@nutrition/usda'
import { INutrientKey } from '@nutrition/core'
import { Layout } from '@/containers/Layout'

// TODO: move into @nutrition/usda
const foodToSlug = (food: IOutputFood) => food.name.toLowerCase().replace(/\s/g, '-').replace(/[^0-9|a-z|-]/g, '')

interface IOutputFoodPageProps {
  food: IOutputFood
}

const UsdaFoodPage = ({ food }: IOutputFoodPageProps) => {
  // TODO: set default in @nutrition/usda
  const [selectedVariant, setSelectedVariant] = useState(
    food.variants.find(v => v.name === food.name) || food.variants[0]
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
            a.name < b.name ? -1 :
            a.name > b.name ? 1 :
            0
          )
          .map(variant => (
            <option key={variant.sourceId} value={variant.sourceId} selected={variant.sourceId === selectedVariant.sourceId}>
              {variant.name}
            </option>
          ))
        }
      </select>

      <h2>{selectedVariant.name}</h2>

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

export const getStaticProps: GetStaticProps<IOutputFoodPageProps> = async ({ params }) => {
  const food = foods.find(food => foodToSlug(food) === params!.slug)

  return {
    props: {
      food: food!
    }
  }
}

export default UsdaFoodPage
