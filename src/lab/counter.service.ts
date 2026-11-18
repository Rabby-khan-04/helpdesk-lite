import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CounterService {
  private count = 0;

  constructor() {
    console.log(`Counter service created`);
  }

  next() {
    return ++this.count;
  }
}
