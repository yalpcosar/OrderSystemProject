import { ESize } from "app/core/enums/e-size.enum";
import { BaseModel } from "app/core/models/BaseModel";

export interface Product extends BaseModel{
    name: string;
    size: ESize;
    pColorId: number;
    quantity: number;
}