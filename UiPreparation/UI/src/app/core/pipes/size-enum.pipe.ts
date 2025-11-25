import { Pipe, PipeTransform } from '@angular/core';
import { ESize } from '../enums/e-size.enum';

@Pipe({
  name: 'sizeEnum'
})
export class SizeEnumPipe implements PipeTransform {

  transform(value: number): string {
    switch(value) {
      case ESize.Small:
        return 'Small';
      case ESize.Medium:
        return 'Medium';
      case ESize.Large:
        return 'Large';
      case ESize.XLarge:
        return 'XLarge';
      default:
        return 'Unknow';
    }
  }
}
