import { SizeEnum } from '../enums/size.enum';

export class Order {
  id: number;
  customerId: number;
  productId: number;
  quantity: number;
  orderNumber: string;
  orderDate: Date;
  createdUserId: number;
  createdDate: Date;
  lastUpdatedUserId: number;
  lastUpdatedDate: Date;
  status: boolean;
  isDeleted: boolean;
}

export class OrderDetail {
  id: number;
  orderNumber: string;
  orderDate: Date;
  customerId: number;
  customerName: string;
  customerCode: string;
  productId: number;
  productName: string;
  colorName: string;
  size: SizeEnum;
  quantity: number;
  status: boolean;
  createdDate: Date;
}

export class CreateOrderDto {
  customerId: number;
  productId: number;
  quantity: number;
  orderNumber: string;
}
