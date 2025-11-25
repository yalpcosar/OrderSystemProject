import { ESize } from "app/core/enums/e-size.enum";

export interface ProductDetailDto {
    productId: number;
    productName: string;
    colorName: string;
    hexCode: String;
    size: ESize;
    quantity: number;
    isReadyForSale: boolean;
}