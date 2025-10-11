export class Customer {
  id: number;
  customerName: string;
  customerCode: string;
  address: string;
  phoneNumber: string;
  email: string;
  createdUserId: number;
  createdDate: Date;
  lastUpdatedUserId: number;
  lastUpdatedDate: Date;
  status: boolean;
  isDeleted: boolean;
}

export class CreateCustomerDto {
  customerName: string;
  customerCode: string;
  address: string;
  phoneNumber: string;
  email: string;
}

export class UpdateCustomerDto {
  id: number;
  customerName: string;
  customerCode: string;
  address: string;
  phoneNumber: string;
  email: string;
}
