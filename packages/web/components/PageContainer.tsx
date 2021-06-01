import styled from '@emotion/styled'
import { desktop } from '@/styles/breakpoints'

export const PageContainer = styled.div`
  width: 100%;
  padding: 0 20px;

  ${desktop} {
    width: 800px;
    max-width: 100%;

    margin: auto;
  }
`
