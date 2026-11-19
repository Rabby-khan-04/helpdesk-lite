import { Injectable, Logger } from '@nestjs/common';
import { Notifier } from './notifier.js';

@Injectable()
export class LogNotifier implements Notifier {
  private readonly logger = new Logger('Notification');

  notify(message: string) {
    this.logger.log(message);
  }
}
