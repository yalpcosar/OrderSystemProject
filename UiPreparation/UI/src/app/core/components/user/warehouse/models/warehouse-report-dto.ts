import { WarehouseItemDto } from "./warehouse-item-dto";

export interface WarehouseReportDto {
    items: WarehouseItemDto[]; // ItemDto Listesi 
    totalProducts: number;
    outOfStock: number;
}