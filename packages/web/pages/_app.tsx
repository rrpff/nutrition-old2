import type { AppProps } from 'next/app'
import Router from 'next/router'
import { withDependencies } from '@/utils/withDependencies'
import { SupabaseAuthGateway } from '@/gateways/SupabaseAuthGateway'
import { supabase } from '@/utils/supabaseClient'
import { NextRoutingGateway } from '@/gateways/NextRoutingGateway'

import '../styles/variables.css'
import '../styles/globals.css'

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default withDependencies<AppProps>(App, {
  authGateway: new SupabaseAuthGateway(supabase),
  routingGateway: new NextRoutingGateway(Router),
})
