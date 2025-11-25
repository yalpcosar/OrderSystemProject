import { BaseModel } from "app/core/models/BaseModel";

export interface PColor extends BaseModel {
    name: string;
    hexCode: string;
}