import { BaseModel } from "app/core/models/BaseModel";

export interface Warehouse extends BaseModel {
    productId: number;
    quantity: number;
    isAvailableForSale: boolean;
}