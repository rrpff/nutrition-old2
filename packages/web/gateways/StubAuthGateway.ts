import { IAuthGateway, IAuthResult, IAuthState, IEmailPasswordRequest } from '@/types'
import { generateEmail, generatePassword } from '../test/generators'

type IListener = (state: IAuthState) => void

export class StubAuthGateway implements IAuthGateway {
  public correctTestEmail = generateEmail()
  public correctTestPassword = generatePassword()
  public invalidLoginMessage = 'INVALID LOGIN'
  public invalidSignupMessage = 'INVALID SIGN UP'
  public successfulSignupMessage = 'SUCCESSFUL SIGN UP'
  public testUserId = '123'
  public testAccessToken = '123456'

  private listeners: IListener[] = []

  constructor(public state: IAuthState = { session: null }) {}

  onAuthStateChange(listener: (state: IAuthState) => void) {
    this.listeners.push(listener)
  }

  async signInWithEmailAndPassword({ email, password }: IEmailPasswordRequest) {
    const isCorrect = this.correctTestEmail === email
      && this.correctTestPassword === password

    const result = {
      success: isCorrect,
      message: null,
      error: isCorrect ? null : this.invalidLoginMessage,
    }

    if (result.success) {
      this.listeners.forEach(listener => listener({
        session: {
          user: { id: this.testUserId },
          credentials: { accessToken: this.testAccessToken },
        }
      }))
    }

    return result
  }

  async signUpWithEmailAndPassword({ email, password }: IEmailPasswordRequest): Promise<IAuthResult> {
    const isCorrect = this.correctTestEmail === email
      && this.correctTestPassword === password

    return {
      success: isCorrect,
      message: isCorrect ? this.successfulSignupMessage : null,
      error: isCorrect ? null : this.invalidSignupMessage,
    }
  }

  async signOut(): Promise<IAuthResult> {
    this.state = { session: null }

    return {
      success: true,
      message: null,
      error: null,
    }
  }
}
