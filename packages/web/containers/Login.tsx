import { useEffect, useState } from 'react'
import { useDependency } from 'react-use-dependency'
import { IAuthGateway, IEmailPasswordRequest, IRoutingGateway } from "@/types"
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/LoginForm'

export const Login = () => {
  const routingGateway = useDependency<IRoutingGateway>('routingGateway')
  const authGateway = useDependency<IAuthGateway>('authGateway')
  const auth = useAuth(authGateway)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (auth.state.session?.user) {
      routingGateway.push('/')
    }
  })

  const handleAttempt = async (attempt: IEmailPasswordRequest) => {
    const result = await auth.signInWithEmailAndPassword(attempt)
    setError(result.error)
  }

  return (
    <LoginForm
      onAttempt={handleAttempt}
      error={error}
    />
  )
}
