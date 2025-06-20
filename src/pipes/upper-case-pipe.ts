import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class UpperCasePipe implements PipeTransform {
  transform(value: string) {
    return value.toUpperCase();
  }
}
