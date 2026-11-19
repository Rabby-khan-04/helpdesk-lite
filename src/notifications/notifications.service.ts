import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import type { Notifier, NotifyChannel } from './notifier.js';
import { NOTIFIER_TOKEN } from './notifier.js';

@Injectable()
export class NotificationService {
  constructor(private readonly moduleRef: ModuleRef) {}

  async send(channel: NotifyChannel, message: string) {
    const notifier = this.moduleRef.get<Notifier>(NOTIFIER_TOKEN[channel]);
    await notifier.notify(message);
  }
}
