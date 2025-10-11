export class Color {
  id: number;
  name: string;
  hexCode: string;
  createdUserId: number;
  createdDate: Date;
  lastUpdatedUserId: number;
  lastUpdatedDate: Date;
  status: boolean;
  isDeleted: boolean;
}

export class CreateColorDto {
  name: string;
  hexCode: string;
}

export class UpdateColorDto {
  id: number;
  name: string;
  hexCode: string;
}
