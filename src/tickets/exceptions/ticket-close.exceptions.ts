import { BadRequestException } from '@nestjs/common';
import { ErrorCode } from '../../common/error-codes.js';

export class TicketCloseExceptions extends BadRequestException {
  constructor(message = 'Closed ticket cannot be updated') {
    super(message, { errorCode: ErrorCode.TicketClosed });
  }
}
