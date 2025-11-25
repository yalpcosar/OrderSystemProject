import { ESize } from "../../../../enums/e-size.enum";

export interface WarehouseItemDto {
    warehouseId: number;
    productId: number;
    productName: string;
    colorName: string;
    size: ESize;
    quantity: number;
    isAvailableForSale: boolean;
}