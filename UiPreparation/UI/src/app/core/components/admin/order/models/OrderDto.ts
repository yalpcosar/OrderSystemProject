export class OrderDto {
  orderId: number;
  customerName: string;
  productName: string;
  productCode: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: string;
  orderDate: Date;
  deliveryDate: Date;
}

