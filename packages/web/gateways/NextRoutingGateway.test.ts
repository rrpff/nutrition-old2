import { SingletonRouter as NextRouter } from 'next/router'
import { NextRoutingGateway } from './NextRoutingGateway'

it.each([
  '/test',
  '/a/b/c',
])('should return the current path', expectedPath => {
  const router = createStubRouter(expectedPath)
  const gateway = new NextRoutingGateway(router)

  expect(gateway.pathname).toEqual(router.pathname)
})

it.each([
  '/test',
  '/a/b/c',
])('should return the current path', (newPath) => {
  const router = createStubRouter('/')
  const gateway = new NextRoutingGateway(router)

  gateway.push(newPath)
  expect(gateway.pathname).toEqual(newPath)
})

const createStubRouter = (pathname: string): NextRouter => {
  return {
    get pathname() { return pathname },
    push: (path: string) => { pathname = path }
  } as NextRouter
}
