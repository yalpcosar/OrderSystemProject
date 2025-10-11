import { Pipe, PipeTransform } from '@angular/core';
import { SizeEnum, getSizeLabel } from '../../enums/size.enum';

@Pipe({
  name: 'sizeLabel'
})
export class SizeLabelPipe implements PipeTransform {

  transform(value: SizeEnum): string {
    if (value === null || value === undefined) {
      return '';
    }
    return getSizeLabel(value);
  }
}
