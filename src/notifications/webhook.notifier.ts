import { Injectable, Logger } from '@nestjs/common';
import { Notifier } from './notifier.js';

@Injectable()
export class Webhook implements Notifier {
  private readonly logger = new Logger('Webhook');

  async notify(message: string) {
    await this.logger.log(
      `POST https://example.invalid/hook {"text":"${message}"}`,
    );
  }
}
