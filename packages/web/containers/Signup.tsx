import { useEffect, useState } from 'react'
import { useDependency } from 'react-use-dependency'
import { IAuthGateway, IEmailPasswordRequest, IRoutingGateway } from "@/types"
import { useAuth } from '@/hooks/useAuth'
import { SignupForm } from '@/components/SignupForm'

export const Signup = () => {
  const routingGateway = useDependency<IRoutingGateway>('routingGateway')
  const authGateway = useDependency<IAuthGateway>('authGateway')
  const auth = useAuth(authGateway)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (auth.state.session?.user) {
      routingGateway.push('/')
    }
  })

  const handleAttempt = async (attempt: IEmailPasswordRequest) => {
    const result = await auth.signUpWithEmailAndPassword(attempt)
    setMessage(result.message)
    setError(result.error)
  }

  return (
    <SignupForm
      onAttempt={handleAttempt}
      message={message}
      error={error}
    />
  )
}
