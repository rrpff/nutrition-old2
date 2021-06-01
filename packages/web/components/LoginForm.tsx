import { FormEvent, useMemo, useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { Span } from './Text'

export interface ILoginFormProps {
  onAttempt: (attempt: { email: string, password: string }) => void
  error?: string | null
}

export const LoginForm = ({
  error = null,
  onAttempt = () => {},
}: ILoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const canSubmit = useMemo(() => email !== '' && password !== '', [email, password])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onAttempt({ email, password })
  }

  return (
    <div>
      {error ? <Span mode="error" data-testid="login-error">{error}</Span> : null}

      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="username"
          id="email"
          label="Email address"
          placeholder="dana@example.com"
          data-testid="login-email-input"
          onChange={e => setEmail(e.target.value)}
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="••••••••••••••"
          data-testid="login-password-input"
          onChange={e => setPassword(e.target.value)}
        />

        <Button mode="primary" disabled={!canSubmit} data-testid="login-submit">
          Log in
        </Button>
      </form>
    </div>
  )
}
