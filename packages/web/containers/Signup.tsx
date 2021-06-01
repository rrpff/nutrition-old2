import { FormEvent, useEffect, useState } from 'react'
import { useDependency } from 'react-use-dependency'
import { IAuthGateway, IRoutingGateway } from "@/types"
import { useAuth } from '@/hooks/useAuth'

export const Signup = () => {
  const routingGateway = useDependency<IRoutingGateway>('routingGateway')
  const authGateway = useDependency<IAuthGateway>('authGateway')
  const auth = useAuth(authGateway)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (auth.state.session?.user) {
      routingGateway.push('/')
    }
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = await auth.signUpWithEmailAndPassword({ email, password })
    setMessage(result.message)
    setError(result.error)
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
