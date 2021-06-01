import { NextRouter } from 'next/router'
import { IRoutingGateway } from '@/types'

export class NextRoutingGateway implements IRoutingGateway {
  constructor(private router: NextRouter) {}

  get pathname(): string {
    return this.router.pathname
  }

  push(path: string): void {
    this.router.push(path)
  }
}
