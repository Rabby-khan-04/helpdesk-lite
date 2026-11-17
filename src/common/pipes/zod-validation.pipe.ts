import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipea<T extends z.ZodType> implements PipeTransform {
  constructor(private readonly schema: T) {}
  transform(value: unknown, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const { formErrors, fieldErrors } = z.flattenError(result.error);
      console.log(formErrors, fieldErrors);
      throw new BadRequestException(
        {
          message: 'Validation error',
          formErrors,
          fieldErrors,
        },
        { errorCode: 'VALIDATION_ERRORS' },
      );
    }

    return result.data;
  }
}
