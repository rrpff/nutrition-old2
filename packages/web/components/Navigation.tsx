import Link from 'next/link'
import styled from '@emotion/styled'
import { AnchorHTMLAttributes, DetailedHTMLProps, MouseEvent, useState } from 'react'
import { GrMenu, GrClose } from 'react-icons/gr'
import { PageContainer } from './PageContainer'
import { desktop } from '../styles/breakpoints'

type ILinkProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
type INavigationLink = ILinkProps & {
  name: string
  href: string
}

export interface INavigationProps {
  primaryLinks?: INavigationLink[]
  secondaryLinks?: INavigationLink[]
  selectedHref?: string
}

export const Navigation = ({
  primaryLinks = [],
  secondaryLinks = [],
  selectedHref,
}: INavigationProps) => {
  const [expanded, setExpanded] = useState(false)

  const handleOpen = (e: MouseEvent) => {
    e.preventDefault()
    setExpanded(true)
  }

  const handleClose = (e: MouseEvent) => {
    e.preventDefault()
    setExpanded(false)
  }

  const renderLink = (link: INavigationLink, index: number) => {
    const { name, href, onClick, ...linkProps } = link

    return (
      <NavigationItem key={index}>
        <Link href={link.href} passHref>
          <NavigationLink
            selected={selectedHref === link.href}
            onClick={e => {
              setExpanded(false)
              onClick?.call(null, e)
            }}

            {...linkProps}
          >
            {link.name}
          </NavigationLink>
        </Link>
      </NavigationItem>
    )
  }

  return (
    <NavigationBar expanded={expanded}>
      {expanded ? (
        <MobileIconContainer>
          <a href="#!" onClick={handleClose}>
            <GrClose />
          </a>
        </MobileIconContainer>
      ) : (
        <MobileIconContainer>
          <a href="#!" onClick={handleOpen}>
            <GrMenu />
            <span>menu</span>
          </a>
        </MobileIconContainer>
      )}
      <PageContainer>
        <NavigationItems expanded={expanded}>
          <NavigationSection mode="primary">
            {primaryLinks.map(renderLink)}
          </NavigationSection>

          <NavigationSection mode="secondary">
            {secondaryLinks.map(renderLink)}
          </NavigationSection>
        </NavigationItems>
      </PageContainer>
    </NavigationBar>
  )
}

const NavigationBar = styled.nav<{ expanded: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: left;

  background: var(--n-background);

  position: ${props => props.expanded ? 'fixed' : 'absolute'};
  top: 0px;
  left: 0px;
  width: 100%;
  height: ${props => props.expanded ? '100%' : '70px'};
  z-index: 90;

  ${desktop} {
    position: absolute;
    align-items: center;
    flex-direction: row;

    height: 70px;
  }
`

const MobileIconContainer = styled.div`
  display: block;
  font-size: 2rem;
  padding: 20px;

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  span {
    font-size: 1rem;
    color: var(--n-foreground);
    padding-left: 12px;
    opacity: 0.8;
  }

  > a > svg path {
    stroke: var(--n-foreground);
  }

  ${desktop} {
    display: none;
  }
`

const NavigationItems = styled.ul<{ expanded: boolean }>`
  display: ${props => props.expanded ? 'block' : 'none'};

  margin: 0px;
  padding: 20px 0px 0px;
  list-style-type: none;
  width: 100%;

  ${desktop} {
    display: flex;
    justify-content: space-between;
    padding: 0px 0px 4px 0px;
  }
`

const NavigationSection = styled.section<{ mode: 'primary' | 'secondary' }>`
  display: block;

  margin-top: ${props => props.mode === 'secondary' ? '20px' : 'none'};
  border-top: ${props => props.mode === 'secondary' ? '1px solid var(--n-accent-200)' : 'none'};
  padding-top: ${props => props.mode === 'secondary' ? '20px' : 'none'};

  ${desktop} {
    display: inline-flex;
    margin-top: 0;
    border-top: 0;
    padding-top: 0;
  }
`

const NavigationItem = styled.li`
  display: block;

  ${desktop} {
    display: inline-block;
    padding: 0 3px 0 0;
  }
`

const NavigationLink = styled.a<{ selected: boolean }>`
  color: var(--n-foreground);
  font-weight: ${props => props.selected ? 'bold' : 'normal'};

  display: block;
  padding: 6px 0;
  font-size: 2rem;

  ${desktop} {
    padding-right: 8px;
    font-size: 1rem;
  }
`
