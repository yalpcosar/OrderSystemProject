import { Pipe, PipeTransform } from '@angular/core';
import { GenderEnum, getGenderLabel } from '../../enums/gender.enum';

@Pipe({
  name: 'genderLabel'
})
export class GenderLabelPipe implements PipeTransform {

  transform(value: GenderEnum): string {
    if (value === null || value === undefined) {
      return '';
    }
    return getGenderLabel(value);
  }
}
