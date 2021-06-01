import Link from 'next/link'
import { Fragment, ReactNode, useEffect, useState } from 'react'
import { useDependency } from 'react-use-dependency'
import styled from '@emotion/styled'
import { IAuthGateway } from '@/types'
import { useAuth } from '@/hooks/useAuth'

export interface ILayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: ILayoutProps) => {
  const authGateway = useDependency<IAuthGateway>('authGateway')
  const auth = useAuth(authGateway)
  const [displayAuthLinks, setDisplayAuthLinks] = useState(false)

  useEffect(() => {
    setDisplayAuthLinks(true)
  }, [])

  const loggedIn = auth.state.session?.user !== undefined

  return (
    <Container>
      <nav>
        {displayAuthLinks && (
          <Fragment>
            {loggedIn ? (
              <a href="#!" data-testid="sign-out-link" onClick={e => {
                e.preventDefault()
                auth.signOut()
              }}>
                Sign out
              </a>
            ) : (
              <Fragment>
                <Link href="/login">
                  <a data-testid="login-link">
                    Log in
                  </a>
                </Link>

                <Link href="/signup">
                  <a data-testid="signup-link">
                    Sign up
                  </a>
                </Link>
              </Fragment>
            )}
          </Fragment>
        )}
      </nav>
      {children}
    </Container>
  )
}

const Container = styled.main`
  display: block;
  position: relative;
  margin: auto;

  width: 800px;
  max-width: 100%;

  padding: 30px;
`
