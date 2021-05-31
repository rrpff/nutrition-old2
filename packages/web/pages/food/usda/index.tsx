import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { foods, IUsdaFood } from '@nutrition/usda'
import { Layout } from '@/containers/Layout'

// TODO: move into @nutrition/usda
const foodToSlug = (food: IUsdaFood) => food.name.toLowerCase().replace(/\s/g, '-').replace(/[^0-9|a-z|-]/g, '')

interface IUsdaFoodsIndexProps {
  foods: {
    name: string
    path: string
  }[]
}

const UsdaFoodsIndex = ({ foods }: IUsdaFoodsIndexProps) => {
  return (
    <Layout>
      <Head>
        <title>Nutrition</title>
      </Head>

      <h1>USDA Foods</h1>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {foods.map(food => (
          <li key={food.path}>
            <Link href={food.path}><a>{food.name}</a></Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<IUsdaFoodsIndexProps> = async ({ params }) => {
  const foodPaths = foods.map(food => ({
    name: food.name,
    path: `/food/usda/${foodToSlug(food)}`
  }))

  return {
    props: {
      foods: foodPaths,
    }
  }
}

export default UsdaFoodsIndex
