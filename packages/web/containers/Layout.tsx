import styled from '@emotion/styled'
import { MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import { useDependency } from 'react-use-dependency'
import { IAuthGateway, IRoutingGateway } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { Navigation } from '@/components/Navigation'
import { PageContainer } from '@/components/PageContainer'

export interface ILayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: ILayoutProps) => {
  const routingGateway = useDependency<IRoutingGateway>('routingGateway')
  const authGateway = useDependency<IAuthGateway>('authGateway')
  const auth = useAuth(authGateway)

  const primaryLinks = [
    { name: 'Nutrition', href: '/' },
    { name: 'Foods', href: '/food/usda' },
  ]

  const secondaryLinks = useMemo(() => {
    const loggedIn = auth.state.session?.user !== undefined

    if (loggedIn) {
      return [{
        name: 'Sign out',
        href: '#!',
        'data-testid': 'sign-out-link',
        onClick: (e: MouseEvent) => {
          e.preventDefault()
          auth.signOut()
        }
      }]
    } else {
      return [
        { name: 'Log in', href: '/login', 'data-testid': 'login-link' },
        { name: 'Sign up', href: '/signup', 'data-testid': 'signup-link' },
      ]
    }
  }, [auth.state.session?.user])

  return (
    <PageContainer>
      <Navigation
        primaryLinks={primaryLinks}
        secondaryLinks={secondaryLinks}
        selectedHref={routingGateway.pathname}
      />

      <PageMargin>
        {children}
      </PageMargin>
    </PageContainer>
  )
}

const PageMargin = styled.div`
  margin-top: 70px;
`
