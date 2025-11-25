export interface BaseModel {
    id: number;
    status: boolean;
    isDeleted?: boolean;
    createdDate?: string;
    lastUpdatedDate?: string;
}