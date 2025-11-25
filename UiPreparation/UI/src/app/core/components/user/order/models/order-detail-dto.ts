import { ESize } from "app/core/enums/e-size.enum";

export interface OrderDetailDto {
    orderId: number;
    orderDate: string;
    quantity: number;
    status: boolean;

    customerId: number;
    customerName: string;
    customerCode: string;

    productId: number;
    productName: string;
    colorName: string;
    size: ESize;
}