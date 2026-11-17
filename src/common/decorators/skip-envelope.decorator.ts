import { Reflector } from '@nestjs/core';

export const SkipEnvelope = Reflector.createDecorator<boolean>();
