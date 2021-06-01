export type IEmailPasswordRequest = {
  email: string
  password: string
}

export type IAuthCredentials = {
  accessToken: string
}

export type IAuthUser = {
  id: string
}

export type IAuthSession = {
  credentials: IAuthCredentials
  user: IAuthUser
}

export type IAuthState = {
  session: IAuthSession | null
}

export type IAuthResult = {
  success: boolean
  message: string | null
  error: string | null
}

export interface IRoutingGateway {
  push(path: string): void
  pathname: string
}

export interface IAuthGateway {
  signInWithEmailAndPassword(request: IEmailPasswordRequest): Promise<IAuthResult>
  signUpWithEmailAndPassword(request: IEmailPasswordRequest): Promise<IAuthResult>
  signOut(): Promise<IAuthResult>
  onAuthStateChange(callback: (state: IAuthState) => void): void
  state: IAuthState
}

export type IUseAuthHook = (gateway: IAuthGateway) => {
  signInWithEmailAndPassword(request: IEmailPasswordRequest): Promise<IAuthResult>
  signUpWithEmailAndPassword(request: IEmailPasswordRequest): Promise<IAuthResult>
  signOut(): Promise<IAuthResult>
  state: IAuthState
}

export interface IAppDependencies {
  authGateway: IAuthGateway
  routingGateway: IRoutingGateway
}
