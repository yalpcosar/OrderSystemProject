import { BaseModel } from "app/core/models/BaseModel";

export interface Order extends BaseModel{
  customerId: number;
  productId: number;
  quantity: number;
}