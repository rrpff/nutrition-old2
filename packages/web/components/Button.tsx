import { desktop } from '@/styles/breakpoints'
import styled from '@emotion/styled'

export interface IButtonProps {
  mode?: 'primary' | 'default'
}

export const Button = styled.button<IButtonProps>`
  display: block;

  padding: 12px 40px;
  margin: 12px 0;

  border-radius: 2px;
  font-size: 1rem;

  width: 100%;

  ${desktop} {
    width: auto;
  }

  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  background: ${props => props.mode === 'primary'
    ? 'var(--n-foreground)'
    : 'var(--n-accent-100)'
  };

  border: 1px solid ${props => props.mode === 'primary'
    ? 'var(--n-foreground)'
    : 'var(--n-accent-200)'
  };

  color: ${props => props.mode === 'primary'
    ? 'var(--n-background)'
    : 'var(--n-foreground)'
  };

  opacity: ${props => props.disabled ? 0.6 : 1.0};
`
