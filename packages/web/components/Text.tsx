import styled from "@emotion/styled";

export interface ISpanProps {
  mode?: 'success' | 'error' | 'danger' | 'info' | 'warning' | 'default'
}

export const H1 = styled.h1``
export const H2 = styled.h2``
export const H3 = styled.h3``
export const H4 = styled.h4``
export const H5 = styled.h5``
export const H6 = styled.h6``
export const Paragraph = styled.p``

export const Span = styled.span<ISpanProps>`
  color: ${props =>
    props.mode === 'success' ? 'var(--n-success-800)' :
    props.mode === 'info' ? 'var(--n-info-800)' :
    props.mode === 'danger' ? 'var(--n-danger-800)' :
    props.mode === 'error' ? 'var(--n-danger-800)' :
    props.mode === 'warning' ? 'var(--n-warning-800)' :
    'var(--n-foreground)'
  }
`
