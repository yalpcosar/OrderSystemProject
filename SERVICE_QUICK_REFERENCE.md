# Service Quick Reference Card

## 🚀 Import Statements

```typescript
// Services
import { PColorService } from './services/PColor.service';
import { CustomerService } from './services/Customer.service';
import { ProductService } from './services/Product.service';
import { WarehouseService } from './services/Warehouse.service';
import { OrderService } from './services/Order.service';
import { LookUpService } from 'app/core/services/lookUp.service';

// Models
import { PColor } from './models/PColor';
import { Customer } from './models/Customer';
import { Product } from './models/Product';
import { Warehouse } from './models/Warehouse';
import { Order } from './models/Order';
import { OrderDto } from './models/OrderDto';
import { LookUp } from 'app/core/models/lookUp';
```

---

## 📦 Service API Reference

### PColorService
| Method | Return Type | Endpoint |
|--------|-------------|----------|
| `getColorList()` | `Observable<PColor[]>` | `GET /pcolors/` |
| `getColorById(id)` | `Observable<PColor>` | `GET /pcolors/{id}` |
| `addColor(color)` | `Observable<any>` | `POST /pcolors/` |
| `updateColor(color)` | `Observable<any>` | `PUT /pcolors/` |
| `deleteColor(id)` | `Observable<any>` | `DELETE /pcolors/{id}` |

### CustomerService
| Method | Return Type | Endpoint |
|--------|-------------|----------|
| `getCustomerList()` | `Observable<Customer[]>` | `GET /customers/` |
| `getCustomerById(id)` | `Observable<Customer>` | `GET /customers/{id}` |
| `addCustomer(customer)` | `Observable<any>` | `POST /customers/` |
| `updateCustomer(customer)` | `Observable<any>` | `PUT /customers/` |
| `deleteCustomer(id)` | `Observable<any>` | `DELETE /customers/{id}` |

### ProductService
| Method | Return Type | Endpoint |
|--------|-------------|----------|
| `getProductList()` | `Observable<Product[]>` | `GET /products/` |
| `getProductById(id)` | `Observable<Product>` | `GET /products/{id}` |
| `addProduct(product)` | `Observable<any>` | `POST /products/` |
| `updateProduct(product)` | `Observable<any>` | `PUT /products/` |
| `deleteProduct(id)` | `Observable<any>` | `DELETE /products/{id}` |
| `getProductsWithStock()` ⭐ | `Observable<Product[]>` | `GET /products/with-stock` |

### WarehouseService
| Method | Return Type | Endpoint |
|--------|-------------|----------|
| `getWarehouseList()` | `Observable<Warehouse[]>` | `GET /warehouses/` |
| `getWarehouseById(id)` | `Observable<Warehouse>` | `GET /warehouses/{id}` |
| `addWarehouse(warehouse)` | `Observable<any>` | `POST /warehouses/` |
| `updateWarehouse(warehouse)` | `Observable<any>` | `PUT /warehouses/` |
| `deleteWarehouse(id)` | `Observable<any>` | `DELETE /warehouses/{id}` |
| `getWarehouseReport()` ⭐ | `Observable<any>` | `GET /warehouses/report` |
| `checkAvailability(productId, qty)` ⭐ | `Observable<any>` | `GET /warehouses/check-availability?productId={id}&quantity={qty}` |

### OrderService
| Method | Return Type | Endpoint |
|--------|-------------|----------|
| `getOrderList()` | `Observable<OrderDto[]>` | `GET /orders/dto` |
| `getOrderById(id)` | `Observable<Order>` | `GET /orders/{id}` |
| `addOrder(order)` | `Observable<any>` | `POST /orders/` |
| `updateOrder(order)` | `Observable<any>` | `PUT /orders/` |
| `deleteOrder(id)` | `Observable<any>` | `DELETE /orders/{id}` |
| `getOrderReport(start?, end?)` ⭐ | `Observable<any>` | `GET /orders/report?startDate={date}&endDate={date}` |

### LookUpService (Extended)
| Method | Return Type | Endpoint |
|--------|-------------|----------|
| `getPColorLookUp()` 🆕 | `Observable<LookUp[]>` | `GET /pcolors/lookups` |
| `getCustomerLookUp()` 🆕 | `Observable<LookUp[]>` | `GET /customers/lookups` |
| `getProductLookUp()` 🆕 | `Observable<LookUp[]>` | `GET /products/lookups` |

---

## 📋 Model Structures

### PColor
```typescript
{
  id: number;
  name: string;
  code: string;  // Hex color code
}
```

### Customer
```typescript
{
  customerId: number;
  citizenId: string;
  nationalityId: number;
  name: string;
  address: string;
  mobilePhones: string;
}
```

### Product
```typescript
{
  productId: number;
  productCode: string;
  productName: string;
  price: number;
  stock: number;
  pColorId: number;
  pColorName?: string;  // Optional, for display
}
```

### Warehouse
```typescript
{
  id: number;
  productId: number;
  productName?: string;   // Optional, for display
  productCode?: string;   // Optional, for display
  stock: number;
  address: string;
  description: string;
}
```

### Order
```typescript
{
  orderId: number;
  customerId: number;
  productId: number;
  productCode: string;
  quantity: number;
  price: number;
  status: number;
  orderDate: Date;
  deliveryDate: Date;
}
```

### OrderDto (for display)
```typescript
{
  orderId: number;
  customerName: string;
  productName: string;
  productCode: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: string;
  orderDate: Date;
  deliveryDate: Date;
}
```

### LookUp
```typescript
{
  id: any;
  label: string;
}
```

---

## 💡 Common Usage Patterns

### Pattern 1: Get List
```typescript
ngOnInit() {
  this.productService.getProductList().subscribe(data => {
    this.productList = data;
    this.dataSource = new MatTableDataSource(data);
  });
}
```

### Pattern 2: Get By ID
```typescript
getById(id: number) {
  this.productService.getProductById(id).subscribe(data => {
    this.product = data;
    this.productForm.patchValue(data);
  });
}
```

### Pattern 3: Add/Create
```typescript
add() {
  this.productService.addProduct(this.product).subscribe(data => {
    this.alertifyService.success(data);
    this.getProductList();
    jQuery('#modal').modal('hide');
  });
}
```

### Pattern 4: Update
```typescript
update() {
  this.productService.updateProduct(this.product).subscribe(data => {
    this.alertifyService.success(data);
    this.getProductList();
    jQuery('#modal').modal('hide');
  });
}
```

### Pattern 5: Delete
```typescript
delete(id: number) {
  this.productService.deleteProduct(id).subscribe(data => {
    this.alertifyService.success(data.toString());
    this.productList = this.productList.filter(x => x.productId != id);
    this.dataSource = new MatTableDataSource(this.productList);
  });
}
```

### Pattern 6: Load Dropdown Data
```typescript
ngOnInit() {
  // Load color dropdown
  this.lookUpService.getPColorLookUp().subscribe(data => {
    this.colorDropdownList = data;
  });
  
  // Load customer dropdown
  this.lookUpService.getCustomerLookUp().subscribe(data => {
    this.customerDropdownList = data;
  });
  
  // Load product dropdown
  this.lookUpService.getProductLookUp().subscribe(data => {
    this.productDropdownList = data;
  });
}
```

### Pattern 7: Special Methods

#### Get Products With Stock
```typescript
loadProductsWithStock() {
  this.productService.getProductsWithStock().subscribe(data => {
    this.productsInStock = data;
  });
}
```

#### Check Warehouse Availability
```typescript
checkAvailability(productId: number, quantity: number) {
  this.warehouseService.checkAvailability(productId, quantity).subscribe(
    data => {
      if (data.isAvailable) {
        this.alertifyService.success('Stock available');
      } else {
        this.alertifyService.error('Insufficient stock');
      }
    }
  );
}
```

#### Get Warehouse Report
```typescript
getReport() {
  this.warehouseService.getWarehouseReport().subscribe(data => {
    this.reportData = data;
  });
}
```

#### Get Order Report with Date Range
```typescript
getOrderReport() {
  const startDate = this.reportForm.value.startDate;
  const endDate = this.reportForm.value.endDate;
  
  this.orderService.getOrderReport(startDate, endDate).subscribe(data => {
    this.orderReport = data;
  });
}

// Or without dates
getAllOrders() {
  this.orderService.getOrderReport().subscribe(data => {
    this.orderReport = data;
  });
}
```

---

## 🔄 Constructor Injection

### Basic Component Setup
```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/lookUp.service';

export class ProductComponent implements OnInit {
  
  constructor(
    private productService: ProductService,
    private lookUpService: LookUpService,
    private alertifyService: AlertifyService,
    private formBuilder: FormBuilder
  ) {}
  
  ngOnInit() {
    // Initialize component
  }
}
```

---

## 🎯 File Locations Summary

```
Services Location:
  UiPreparation/UI/src/app/core/components/admin/{module}/services/

Models Location:
  UiPreparation/UI/src/app/core/components/admin/{module}/models/

Shared Services:
  UiPreparation/UI/src/app/core/services/

Shared Models:
  UiPreparation/UI/src/app/core/models/
```

---

## ✅ Service Features

All services include:
- ✅ Full CRUD operations
- ✅ TypeScript type safety
- ✅ Observable-based async operations
- ✅ Automatic JWT token injection (via interceptor)
- ✅ Automatic language header injection
- ✅ Centralized error handling
- ✅ Automatic token refresh on 401
- ✅ Environment-based API URL
- ✅ Unit test setup (.spec.ts files)
- ✅ Injectable with providedIn: 'root'

---

## 🔑 Key Points

1. **All HTTP requests are intercepted** - JWT token is automatically added
2. **Error handling is centralized** - No need to handle auth errors in services
3. **Language is automatic** - Accept-Language header added automatically
4. **Token refresh is automatic** - On 401, token refreshes and request retries
5. **Response types vary**:
   - GET: Typed responses (e.g., `Observable<Product[]>`)
   - POST/PUT: `{ responseType: 'text' }` returns success message
   - DELETE: Uses `request('delete', ...)` pattern

---

*Quick Reference Created: October 10, 2025*

