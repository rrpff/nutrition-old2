import { FormEvent, useState } from 'react'

export interface ISignupFormProps {
  onAttempt: (attempt: { email: string, password: string }) => void
  message?: string | null
  error?: string | null
}

export const SignupForm = ({
  message = null,
  error = null,
  onAttempt = () => {},
}: ISignupFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onAttempt({ email, password })
  }

  return (
    <div>
      {message ? <span data-testid="signup-message">{message}</span> : null}
      {error ? <span data-testid="signup-error">{error}</span> : null}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          data-testid="signup-email-input"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          data-testid="signup-password-input"
          onChange={e => setPassword(e.target.value)}
        />
        <input type="submit" data-testid="signup-submit" />
      </form>
    </div>
  )
}
