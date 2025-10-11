import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeLabelPipe } from './pipes/size-label.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { GenderLabelPipe } from './pipes/gender-label.pipe';

@NgModule({
  declarations: [
    SizeLabelPipe,
    DateFormatPipe,
    GenderLabelPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SizeLabelPipe,
    DateFormatPipe,
    GenderLabelPipe
  ]
})
export class SharedModule { }
