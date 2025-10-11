import { SizeEnum } from '../enums/size.enum';

export class Product {
  id: number;
  name: string;
  colorId: number;
  size: SizeEnum;
  createdUserId: number;
  createdDate: Date;
  lastUpdatedUserId: number;
  lastUpdatedDate: Date;
  status: boolean;
  isDeleted: boolean;
}

export class ProductWithStock {
  id: number;
  name: string;
  colorId: number;
  colorName: string;
  size: SizeEnum;
  quantity: number;
  isAvailableForSale: boolean;
  status: boolean;
}

export class CreateProductDto {
  name: string;
  colorId: number;
  size: SizeEnum;
}
