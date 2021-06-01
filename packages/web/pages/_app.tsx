import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { DependencyProvider } from 'react-use-dependency'
import { SupabaseAuthGateway } from '@/gateways/SupabaseAuthGateway'
import { supabase } from '@/utils/supabaseClient'
import { NextRoutingGateway } from '@/gateways/NextRoutingGateway'

import '../styles/variables.css'
import '../styles/globals.css'

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  const dependencies = {
    authGateway: new SupabaseAuthGateway(supabase),
    routingGateway: new NextRoutingGateway(router),
  }

  return (
    <DependencyProvider value={dependencies}>
      <Component {...pageProps} />
    </DependencyProvider>
  )
}

export default App
