import { ESize } from "./product";

export interface Order {
    id: number;
    customerId: number;
    productId: number;
    quantity: number;
    status: boolean;
    createdDate?: string;
}

export interface OrderDetailDto {
    id: number;
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