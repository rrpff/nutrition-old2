import { render, screen, fireEvent, act } from '@testing-library/react'
import { DependencyProvider } from 'react-use-dependency'
import { IAppDependencies, IAuthState } from "@/types"
import { StubRoutingGateway } from '@/gateways/StubRoutingGateway'
import { StubAuthGateway } from '@/gateways/StubAuthGateway'
import { generateEmail, generatePassword } from '../test/generators'
import { Signup } from './Signup'

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

  expect(routingGateway.pathname).toEqual('/signup')
})

it('displays a confirmation message after successfully signing up', async () => {
  const { authGateway } = subject()

  await fillInEmailWith(authGateway.correctTestEmail)
  await fillInPasswordWith(authGateway.correctTestPassword)
  await submitForm()

  const message = await screen.findByTestId('signup-message')
  expect(message).toContainHTML(authGateway.successfulSignupMessage)
})

it('displays an error when something goes wrong', async () => {
  const { authGateway } = subject()

  await fillInEmailWith(generateEmail())
  await fillInPasswordWith(generatePassword())
  await submitForm()

  const error = await screen.findByTestId('signup-error')
  expect(error).toContainHTML(authGateway.invalidSignupMessage)
})

const fillInEmailWith = async (value: string) => {
  const emailInput = await screen.findByTestId('signup-email-input')
  return fireEvent.change(emailInput, { target: { value } })
}

const fillInPasswordWith = async (value: string) => {
  const emailInput = await screen.findByTestId('signup-password-input')
  return fireEvent.change(emailInput, { target: { value } })
}

const submitForm = async () => {
  const button = await screen.findByTestId('signup-submit')
  await act(async () => {
    fireEvent.click(button)
  })
}

const subject = (options: { initialSessionState?: IAuthState } = {}) => {
  const authGateway = new StubAuthGateway(options.initialSessionState)
  const routingGateway = new StubRoutingGateway('/signup')
  const dependencies: Partial<IAppDependencies> = {
    authGateway,
    routingGateway,
  }

  render(
    <DependencyProvider value={dependencies}>
      <Signup />
    </DependencyProvider>
  )

  return {
    authGateway,
    routingGateway,
  }
}
