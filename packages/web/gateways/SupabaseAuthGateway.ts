import { Session as SupabaseSession, SupabaseClient } from '@supabase/supabase-js'
import { IAuthGateway, IAuthResult, IAuthState, IEmailPasswordRequest } from '@/types'

const MISSING_EMAIL_RESULT = { success: false, message: null, error: 'Email address is missing' }
const MISSING_PASSWORD_RESULT = { success: false, message: null, error: 'Password is missing' }

export const AUTH_STATE_API_URL = typeof window !== 'undefined'
  ? new URL('/api/supabase/auth', window.location.origin).toString()
  : null

export class SupabaseAuthGateway implements IAuthGateway {
  constructor(private client: SupabaseClient) {
    this.client.auth.onAuthStateChange(async (event, session) => {
      await fetch(AUTH_STATE_API_URL!, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
      })
    })
  }

  get state(): IAuthState {
    return mapSupabaseAuthState(this.client.auth.session())
  }

  onAuthStateChange(callback: (state: IAuthState) => void): void {
    this.client.auth.onAuthStateChange((_, session) => {
      callback(mapSupabaseAuthState(session))
    })
  }

  async signInWithEmailAndPassword({ email, password }: IEmailPasswordRequest): Promise<IAuthResult> {
    if (email.trim() === '') return MISSING_EMAIL_RESULT
    if (password.trim() === '') return MISSING_PASSWORD_RESULT

    const result = await this.client.auth.signIn({ email, password })

    return {
      success: result.error === null,
      message: null,
      error: result.error?.message || null,
    }
  }

  async signUpWithEmailAndPassword({ email, password }: IEmailPasswordRequest): Promise<IAuthResult> {
    if (email.trim() === '') return MISSING_EMAIL_RESULT
    if (password.trim() === '') return MISSING_PASSWORD_RESULT

    const result = await this.client.auth.signUp({ email, password })

    return {
      success: result.error === null,
      message: result.error === null ? 'Please check your email for a confirmation link' : null,
      error: result.error?.message || null,
    }
  }

  async signOut(): Promise<IAuthResult> {
    const result = await this.client.auth.signOut()

    return {
      success: result.error === null,
      message: null,
      error: result.error?.message || null,
    }
  }
}

const mapSupabaseAuthState = (session: SupabaseSession | null): IAuthState => {
  if (!session) return { session: null }

  return {
    session: {
      credentials: { accessToken: session.access_token },
      user: { id: session.user!.id },
    }
  }
}
