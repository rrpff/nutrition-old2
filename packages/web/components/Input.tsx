import { desktop } from '@/styles/breakpoints'
import styled from '@emotion/styled'

export const Input = styled.input`
  display: block;
  border: 1px solid var(--n-accent-200);
  border-radius: 2px;

  padding: 12px;
  margin: 12px 0;

  font-size: 1rem;
  width: 100%;

  ${desktop} {
    width: auto;
    min-width: 60%;
  }
`
