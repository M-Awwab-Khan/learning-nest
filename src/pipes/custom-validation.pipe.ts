import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // If no metatype or it's a native type, return the value as is
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Transform plain object to class instance
    const object = plainToClass(metatype, value);

    // Validate the object
    const errors = await validate(object);

    if (errors.length > 0) {
      // Format error messages
      const errorMessages = errors.map((error) => {
        return Object.values(error.constraints || {}).join(', ');
      });

      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
        statusCode: 400,
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
