import { desktop } from '@/styles/breakpoints'
import styled from '@emotion/styled'
import { DetailedHTMLProps, Fragment, InputHTMLAttributes } from 'react'

type BaseProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export type IInputProps = BaseProps & {
  label?: string
}

export const Input = ({ label, id, ...remaining }: IInputProps) => {
  return (
    <div>
      {label !== undefined && (
        <Label htmlFor={id}>{label}</Label>
      )}
      <StyledInput {...remaining} id={id} />
    </div>
  )
}

const Label = styled.label`
  font-weight: bold;

  position: relative;
  display: block;
`

const StyledInput = styled.input`
  display: block;
  border: 1px solid var(--n-accent-200);
  border-radius: 2px;

  padding: 12px;
  margin: 12px 0 24px;

  font-size: 1rem;
  width: 100%;

  &::placeholder {
    color: var(--n-accent-400);
  }

  ${desktop} {
    width: auto;
    min-width: 60%;
  }
`
