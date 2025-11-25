import { BaseModel } from "app/core/models/BaseModel";

export interface Customer extends BaseModel{
    customerName: string;
    customerCode?: string; 
    address: string;
    phoneNumber: string;
    email: string;
}