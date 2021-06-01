import { useEffect, useState } from 'react'
import { IAuthGateway, IEmailPasswordRequest, IUseAuthHook } from '@/types'

export const useAuth: IUseAuthHook = (gateway: IAuthGateway) => {
  const [state, setState] = useState(gateway.state)

  useEffect(() => {
    gateway.onAuthStateChange(updatedState => {
      setState(updatedState)
    })
  }, [])

  const signInWithEmailAndPassword = (input: IEmailPasswordRequest) =>
    gateway.signInWithEmailAndPassword(input)

  const signUpWithEmailAndPassword = (input: IEmailPasswordRequest) =>
    gateway.signUpWithEmailAndPassword(input)

  const signOut = () =>
    gateway.signOut()

  return {
    state,
    signInWithEmailAndPassword,
    signUpWithEmailAndPassword,
    signOut,
  }
}
