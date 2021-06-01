import { FormEvent, useEffect, useState } from 'react'
import { useDependency } from 'react-use-dependency'
import { IAuthGateway, IRoutingGateway } from "@/types"
import { useAuth } from '@/hooks/useAuth'

export const Login = () => {
  const routingGateway = useDependency<IRoutingGateway>('routingGateway')
  const authGateway = useDependency<IAuthGateway>('authGateway')
  const auth = useAuth(authGateway)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (auth.state.session?.user) {
      routingGateway.push('/')
    }
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = await auth.signInWithEmailAndPassword({ email, password })
    setError(result.error)
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
