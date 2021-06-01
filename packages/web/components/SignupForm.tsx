import { FormEvent, useMemo, useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { Span } from './Text'

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
  const canSubmit = useMemo(() => email !== '' && password !== '', [email, password])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onAttempt({ email, password })
  }

  return (
    <div>
      {message ? <Span mode="success" data-testid="signup-message">{message}</Span> : null}
      {error ? <Span mode="error" data-testid="signup-error">{error}</Span> : null}

      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="username"
          label="Email address"
          placeholder="dana@example.com"
          data-testid="signup-email-input"
          onChange={e => setEmail(e.target.value)}
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="••••••••••••••"
          data-testid="signup-password-input"
          onChange={e => setPassword(e.target.value)}
        />

        <Button mode="primary" disabled={!canSubmit} data-testid="signup-submit">
          Sign up
        </Button>
      </form>
    </div>
  )
}
