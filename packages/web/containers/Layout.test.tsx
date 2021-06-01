import { render, screen, fireEvent } from '@testing-library/react'
import { DependencyProvider } from 'react-use-dependency'
import { IAppDependencies, IAuthState } from "@/types"
import { StubRoutingGateway } from '@/gateways/StubRoutingGateway'
import { StubAuthGateway } from '@/gateways/StubAuthGateway'
import { Layout } from './Layout'

it('displays login and signup links when not signed in', async () => {
  subject()

  const loginLink = screen.queryByTestId('login-link')
  expect(loginLink).toBeInTheDocument()

  const signupLink = screen.queryByTestId('signup-link')
  expect(signupLink).toBeInTheDocument()
})

it('hides the sign out link when not signed in', async () => {
  subject()

  const signOutLink = screen.queryByTestId('sign-out-link')
  expect(signOutLink).not.toBeInTheDocument()
})

it('displays a sign out link if already signed in', async () => {
  subject(LOGGED_IN_STATE)

  const signOutLink = screen.queryByTestId('sign-out-link')
  expect(signOutLink).toBeInTheDocument()
})

it('hides the login and signup links when signed in', async () => {
  subject(LOGGED_IN_STATE)

  const loginLink = screen.queryByTestId('login-link')
  expect(loginLink).not.toBeInTheDocument()

  const signupLink = screen.queryByTestId('signup-link')
  expect(signupLink).not.toBeInTheDocument()
})

it('signs out when clicking the sign out link', async () => {
  const { authGateway } = subject(LOGGED_IN_STATE)

  const signOutLink = await screen.findByTestId('sign-out-link')
  fireEvent.click(signOutLink)

  expect(authGateway.state).toEqual({ session: null })
})

const LOGGED_IN_STATE = {
  initialSessionState: {
    session: {
      user: { id: '123' },
      credentials: {} as any,
    }
  }
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
      <Layout>{null}</Layout>
    </DependencyProvider>
  )

  return {
    authGateway,
    routingGateway,
  }
}
