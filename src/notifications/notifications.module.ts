import { Module } from '@nestjs/common';
import { LogNotifier } from './log.notifier.js';
import { NotificationService } from './notifications.service.js';
import { NOTIFIER_TOKEN } from './notifier.js';
import { Webhook } from './webhook.notifier.js';

@Module({
  providers: [
    NotificationService,
    { provide: NOTIFIER_TOKEN.log, useClass: LogNotifier },
    { provide: NOTIFIER_TOKEN.webhook, useClass: Webhook },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
