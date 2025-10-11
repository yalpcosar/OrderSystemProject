import { SizeEnum } from '../enums/size.enum';

export class WarehouseItem {
  productId: number;
  productName: string;
  colorName: string;
  size: SizeEnum;
  quantity: number;
  isAvailableForSale: boolean;
}

export class WarehouseReport {
  items: WarehouseItem[];
  totalProducts: number;
  totalQuantity: number;
  availableForSale: number;
  outOfStock: number;
}

export class ProductAvailability {
  productId: number;
  productName: string;
  colorName: string;
  size: SizeEnum;
  availableQuantity: number;
  isInStock: boolean;
}
