export interface Customer {
    id: number;
    customerName: string;
    customerCode: string;
    address: string;
    phoneNumber: string;
    email: string;
    createdDate?: string;
    status: boolean;
}