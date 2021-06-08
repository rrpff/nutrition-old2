import fetchMock from 'fetch-mock'
import { AUTH_STATE_API_URL, SupabaseAuthGateway } from './SupabaseAuthGateway'
import { supabaseTestClient, SUPABASE_TEST_USER_EMAIL, SUPABASE_TEST_USER_PASSWORD } from '../test/supabaseTestClient'
import { generateEmail, generatePassword } from '../test/generators'

const REUSED_EMAIL_ADDRESS = generateEmail()
const subject = () => new SupabaseAuthGateway(supabaseTestClient)

let authStateApiMock: any // FetchMockStatic
beforeEach(() => authStateApiMock = fetchMock.post(AUTH_STATE_API_URL!, 200))
afterEach(() => fetchMock.restore())

describe('signUpWithEmailAndPassword', () => {
  it('returns an error when email is blank', async () => {
    const result = await subject().signUpWithEmailAndPassword({ email: '', password: generatePassword() })
    expect(result).toEqual({
      success: false,
      message: null,
      error: 'Email address is missing',
    })
  })

  it('returns an error when password is blank', async () => {
    const result = await subject().signUpWithEmailAndPassword({ email: generateEmail(), password: '' })
    expect(result).toEqual({
      success: false,
      message: null,
      error: 'Password is missing',
    })
  })

  it('returns a success message when signing up successfully', async () => {
    const result = await subject().signUpWithEmailAndPassword({ email: generateEmail(), password: generatePassword() })

    expect(result).toEqual({
      success: true,
      message: 'Please check your email for a confirmation link',
      error: null,
    })
  })

  it('returns an error when signing up with the same email twice', async () => {
    await subject().signUpWithEmailAndPassword({ email: REUSED_EMAIL_ADDRESS, password: generatePassword() })
    const secondResult = await subject().signUpWithEmailAndPassword({ email: REUSED_EMAIL_ADDRESS, password: generatePassword() })

    expect(secondResult.success).toEqual(false)
    expect(typeof secondResult.error).toEqual('string')
  })
})

describe('signInWithEmailAndPassword', () => {
  it('returns an error when email is blank', async () => {
    const result = await subject().signInWithEmailAndPassword({ email: '', password: generatePassword() })
    expect(result).toEqual({
      success: false,
      message: null,
      error: 'Email address is missing',
    })
  })

  it('returns an error when password is blank', async () => {
    const result = await subject().signInWithEmailAndPassword({ email: generateEmail(), password: '' })
    expect(result).toEqual({
      success: false,
      message: null,
      error: 'Password is missing',
    })
  })

  it('returns an error when the account does not exist', async () => {
    const result = await subject().signInWithEmailAndPassword({ email: generateEmail(), password: generatePassword() })

    expect(result).toEqual({
      success: false,
      message: null,
      error: 'Invalid email or password',
    })
  })

  it('returns an error when the account has not been confirmed', async () => {
    const email = generateEmail()
    const password = generatePassword()

    await subject().signUpWithEmailAndPassword({ email, password })
    const result = await subject().signInWithEmailAndPassword({ email, password })

    expect(result).toEqual({
      success: false,
      message: null,
      error: 'Email not confirmed',
    })
  })

  it('returns success when the email and password are correct', async () => {
    const email = SUPABASE_TEST_USER_EMAIL
    const password = SUPABASE_TEST_USER_PASSWORD

    const result = await subject().signInWithEmailAndPassword({ email, password })

    expect(result).toEqual({
      success: true,
      message: null,
      error: null,
    })
  })
})

describe('state changes', () => {
  it('posts session data to the API upon successful sign in', async () => {
    const email = SUPABASE_TEST_USER_EMAIL
    const password = SUPABASE_TEST_USER_PASSWORD

    await subject().signInWithEmailAndPassword({ email, password })

    const [_, opts] = authStateApiMock.lastCall()!
    const payload = JSON.parse(opts!.body!.toString())

    expect(payload).toEqual({
      event: 'SIGNED_IN',
      session: supabaseTestClient.auth.session(),
    })
  })

  it('notifies the server on sign out', async () => {
    const email = SUPABASE_TEST_USER_EMAIL
    const password = SUPABASE_TEST_USER_PASSWORD

    await subject().signInWithEmailAndPassword({ email, password })
    await subject().signOut()

    const [_, opts] = authStateApiMock.lastCall()!
    const payload = JSON.parse(opts!.body!.toString())

    expect(payload).toEqual({
      event: 'SIGNED_OUT',
      session: null,
    })
  })
})
