export enum GenderEnum {
  Male = 1,
  Female = 2,
  Other = 3,
  NotSpecified = 4
}

export const GenderLabels: { [key in GenderEnum]: string } = {
  [GenderEnum.Male]: 'Male',
  [GenderEnum.Female]: 'Female',
  [GenderEnum.Other]: 'Other',
  [GenderEnum.NotSpecified]: 'Not Specified'
};

export function getGenderLabel(gender: GenderEnum): string {
  return GenderLabels[gender] || 'Unknown';
}
