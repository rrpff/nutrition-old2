import { render, screen, fireEvent, act } from '@testing-library/react'
import { DependencyProvider } from 'react-use-dependency'
import { IAppDependencies, IAuthState } from "@/types"
import { StubRoutingGateway } from '@/gateways/StubRoutingGateway'
import { StubAuthGateway } from '@/gateways/StubAuthGateway'
import { generateEmail, generatePassword } from '../test/generators'
import { Login } from './Login'

it('redirects immediately if already logged in', async () => {
  const { routingGateway } = subject({
    initialSessionState: {
      session: {
        user: { id: '123' },
        credentials: {} as any,
      }
    }
  })

  expect(routingGateway.pathname).toEqual('/')
})

it('does not redirect immediately if not logged in', async () => {
  const { routingGateway } = subject()

  expect(routingGateway.pathname).toEqual('/login')
})

it('redirects to the root after successfully signing in', async () => {
  const { authGateway, routingGateway } = subject()

  await fillInEmailWith(authGateway.correctTestEmail)
  await fillInPasswordWith(authGateway.correctTestPassword)
  await submitForm()

  expect(routingGateway.pathname).toEqual('/')
})

it('does not redirect when using invalid credentials', async () => {
  const { routingGateway } = subject()

  await fillInEmailWith(generateEmail())
  await fillInPasswordWith(generatePassword())
  await submitForm()

  expect(routingGateway.pathname).toEqual('/login')
})

it('displays an error when using invalid credentials', async () => {
  const { authGateway } = subject()

  await fillInEmailWith(generateEmail())
  await fillInPasswordWith(generatePassword())
  await submitForm()

  const error = await screen.findByTestId('login-error')
  expect(error).toContainHTML(authGateway.invalidLoginMessage)
})

const fillInEmailWith = async (value: string) => {
  const emailInput = await screen.findByTestId('login-email-input')
  return fireEvent.change(emailInput, { target: { value } })
}

const fillInPasswordWith = async (value: string) => {
  const emailInput = await screen.findByTestId('login-password-input')
  return fireEvent.change(emailInput, { target: { value } })
}

const submitForm = async () => {
  const button = await screen.findByTestId('login-submit')
  await act(async () => {
    fireEvent.click(button)
  })
}

const subject = (options: { initialSessionState?: IAuthState } = {}) => {
  const authGateway = new StubAuthGateway(options.initialSessionState)
  const routingGateway = new StubRoutingGateway('/login')
  const dependencies: Partial<IAppDependencies> = {
    authGateway,
    routingGateway,
  }

  render(
    <DependencyProvider value={dependencies}>
      <Login />
    </DependencyProvider>
  )

  return {
    authGateway,
    routingGateway,
  }
}
