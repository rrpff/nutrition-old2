import { IRoutingGateway } from '@/types'

export class StubRoutingGateway implements IRoutingGateway {
  constructor(public pathname: string = '/') {}

  push(newPath: string) {
    this.pathname = newPath
  }
}
