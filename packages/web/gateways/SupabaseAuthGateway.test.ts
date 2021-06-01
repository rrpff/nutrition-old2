import { SupabaseAuthGateway } from './SupabaseAuthGateway'
import { generateEmail, generatePassword } from '../test/generators'
import { supabaseTestClient } from '../test/supabaseTestClient'

const REUSED_EMAIL_ADDRESS = generateEmail()
const subject = () => new SupabaseAuthGateway(supabaseTestClient)

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
})
