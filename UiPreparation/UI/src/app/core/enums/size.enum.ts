export enum SizeEnum {
  S = 1,
  M = 2,
  L = 3,
  XL = 4
}

export const SizeLabels: { [key in SizeEnum]: string } = {
  [SizeEnum.S]: 'Small',
  [SizeEnum.M]: 'Medium',
  [SizeEnum.L]: 'Large',
  [SizeEnum.XL]: 'Extra Large'
};

export function getSizeLabel(size: SizeEnum): string {
  return SizeLabels[size] || 'Unknown';
}
