import { FormEvent, useState } from 'react'

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onAttempt({ email, password })
  }

  return (
    <div>
      {error ? <span data-testid="login-error">{error}</span> : null}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          data-testid="login-email-input"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          data-testid="login-password-input"
          onChange={e => setPassword(e.target.value)}
        />
        <input type="submit" data-testid="login-submit" />
      </form>
    </div>
  )
}
