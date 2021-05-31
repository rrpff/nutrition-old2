import { ReactNode } from 'react'
import styled from '@emotion/styled'

export interface ILayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: ILayoutProps) => {
  return (
    <Container>
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
