import React, { ReactNode } from 'react'
import { DependencyProvider } from 'react-use-dependency'
import { IAppDependencies } from '../types'

export function withDependencies<T>(Child: React.FC<T>, dependencies: Partial<IAppDependencies>) {
  const DependenciesWrapper: React.FC<T & { children: ReactNode }> = props => (
    <DependencyProvider value={dependencies}>
      <Child {...props} />
    </DependencyProvider>
  )

  return DependenciesWrapper
}
