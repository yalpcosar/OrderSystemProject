import { PColor } from "././pcolor/models/pcolor";
import { Warehouse } from "././warehouse/models/warehouse";

export enum ESize {
    Small = 1,
    Medium = 2,
    Large = 3,
    XLarge = 4
}

export interface Product {
    id: number;
    name: string;
    pColorId: number;
    size: ESize;
    createdDate?: string;
    status: boolean;
    
    
    pColor?: PColor;
    warehouse?: Warehouse;
}


export interface ProductDetailDto {
    productId: number;
    productName: string;
    colorName: string;
    hexCode: string;
    size: ESize;
    quantity: number;
    isReadyForSale: boolean;
}