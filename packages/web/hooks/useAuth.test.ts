import { act, renderHook } from '@testing-library/react-hooks'
import { IAuthState } from '@/types'
import { generateEmail, generatePassword } from '../test/generators'
import { useAuth } from './useAuth'

it.each([
  { session: null },
  { session: { credentials: { accessToken: '123' }, user: { id: '123' } } },
  { session: { credentials: { accessToken: '456' }, user: { id: '789' } } },
])('returns the current auth state', (state: IAuthState) => {
  const gateway = createStubAuthGateway(state)
  const { result } = renderHook(() => useAuth(gateway))

  expect(result.current.state).toEqual(state)
})

it.each([
  { session: { credentials: { accessToken: '123' }, user: { id: '123' } } },
  { session: { credentials: { accessToken: '456' }, user: { id: '789' } } },
])('updates the current auth state when it changes', (updatedState: IAuthState) => {
  const gateway = createStubAuthGateway({ session: null })
  const { result } = renderHook(() => useAuth(gateway))

  act(() => { gateway.changeAuthState(updatedState) })

  expect(result.current.state).toEqual(updatedState)
})

describe('signInWithEmailAndPassword', () => {
  it('proxies to the gateway', async () => {
    const gateway = createStubAuthGateway()
    const { result } = renderHook(() => useAuth(gateway))

    const email = generateEmail()
    const password = generatePassword()

    const input = { email, password }
    const output = await result.current.signInWithEmailAndPassword(input)

    expect(gateway.signInWithEmailAndPassword).toHaveBeenCalledWith(input)
    expect(output).toEqual(await gateway.signInWithEmailAndPassword.mock.results[0].value)
  })
})

describe('signUpWithEmailAndPassword', () => {
  it('proxies to the gateway', async () => {
    const gateway = createStubAuthGateway()
    const { result } = renderHook(() => useAuth(gateway))

    const email = generateEmail()
    const password = generatePassword()

    const input = { email, password }
    const output = await result.current.signUpWithEmailAndPassword(input)

    expect(gateway.signUpWithEmailAndPassword).toHaveBeenCalledWith(input)
    expect(output).toEqual(await gateway.signUpWithEmailAndPassword.mock.results[0].value)
  })
})

describe('signOut', () => {
  it('proxies to the gateway', async () => {
    const gateway = createStubAuthGateway()
    const { result } = renderHook(() => useAuth(gateway))

    const output = await result.current.signOut()

    expect(gateway.signOut).toHaveBeenCalled()
    expect(output).toEqual(await gateway.signOut.mock.results[0].value)
  })
})

const createStubAuthGateway = (state: IAuthState = { session: null }) => {
  const listeners: ((value: any) => void)[] = []

  return {
    state,
    signInWithEmailAndPassword: jest.fn(async () => ({
      success: true,
      message: null,
      error: null,
    })),
    signUpWithEmailAndPassword: jest.fn(async () => ({
      success: true,
      message: null,
      error: null,
    })),
    signOut: jest.fn(async () => ({
      success: true,
      message: null,
      error: null,
    })),
    onAuthStateChange: jest.fn((listener: (value: any) => void) => {
      listeners.push(listener)
    }),
    changeAuthState: (newState: IAuthState) => {
      listeners.forEach(listener => listener(newState))
    }
  }
}
