# Angular Module Development Checklist

## 📋 Quick Reference - Reusable vs New Components

---

## ✅ REUSABLE - Already Available

### Core Services (No Changes Needed)
| Service | Location | Purpose |
|---------|----------|---------|
| **HttpEntityRepositoryService** | `core/services/http-entity-repository.service.ts` | Generic CRUD operations |
| **AlertifyService** | `core/services/Alertify.service.ts` | User notifications (success, error, warning, info) |
| **TranslationService** | `core/services/Translation.service.ts` | Multi-language support |
| **LocalStorageService** | `core/services/local-storage.service.ts` | Browser storage management |
| **SharedService** | `core/services/shared.service.ts` | Event broadcasting |
| **AuthService** | `core/components/admin/login/services/Auth.service.ts` | Authentication & authorization |
| **TokenService** | `core/components/admin/login/services/token.service.ts` | Token refresh management |

### Layout Components (No Changes Needed)
| Component | Location | Purpose |
|-----------|----------|---------|
| **AdminLayoutComponent** | `core/components/app/layouts/admin-layout/` | Main application layout |
| **NavbarComponent** | `core/components/app/navbar/` | Top navigation bar |
| **SidebarComponent** | `core/components/app/sidebar/` | Side navigation menu |
| **FooterComponent** | `core/components/app/footer/` | Footer |

### Guards & Interceptors (No Changes Needed)
| Item | Location | Purpose |
|------|----------|---------|
| **LoginGuard** | `core/guards/login-guard.ts` | Route protection |
| **AuthInterceptorService** | `core/interceptors/auth-interceptor.service.ts` | HTTP interceptor with token injection |

### Directives (No Changes Needed)
| Directive | Location | Purpose |
|-----------|----------|---------|
| **MustMatch** | `core/directives/must-match.ts` | Password confirmation validation |

### Models (No Changes Needed)
| Model | Location | Purpose |
|-------|----------|---------|
| **LookUp** | `core/models/LookUp.ts` | Dropdown/multi-select data model |

### Material Components Available
- ✅ MatTable (with pagination & sorting)
- ✅ MatFormField, MatInput
- ✅ MatButton
- ✅ MatSelect
- ✅ MatCheckbox
- ✅ MatPaginator
- ✅ MatSort
- ✅ Multi-select dropdown (ng-multiselect-dropdown)
- ✅ Bootstrap modals
- ✅ SweetAlert2

---

## ⚠️ NEEDS EXTENSION

### LookUp Service
**File:** `core/services/LookUp.service.ts`

**Add these methods:**
```typescript
getPColorLookUp(): Observable<LookUp[]> {
  return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/pcolors/lookups")
}

getCustomerLookUp(): Observable<LookUp[]> {
  return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/customers/lookups")
}

getProductLookUp(): Observable<LookUp[]> {
  return this.httpClient.get<LookUp[]>(environment.getApiUrl + "/products/lookups")
}
```

---

## 🔴 NEW MODULES TO CREATE

### Module 1: Colors (PColor) ⭐ START HERE

#### Files to Create:
```
core/components/admin/pcolor/
├── models/
│   └── PColor.ts
├── services/
│   ├── PColor.service.ts
│   └── PColor.service.spec.ts
├── pcolor.component.ts
├── pcolor.component.html
├── pcolor.component.scss
└── pcolor.component.spec.ts
```

#### Model:
```typescript
export class PColor {
  id: number;
  name: string;
  code: string; // Hex color code
}
```

#### API Endpoints:
- `GET /pcolors/`
- `GET /pcolors/{id}`
- `POST /pcolors/`
- `PUT /pcolors/`
- `DELETE /pcolors/{id}`
- `GET /pcolors/lookups`

#### Table Columns:
`['id', 'name', 'code', 'update', 'delete']`

#### Claims:
- `GetPColorsQuery`
- `CreatePColorCommand`
- `UpdatePColorCommand`
- `DeletePColorCommand`

#### Sidebar Menu:
```typescript
{ path: '/pcolor', title: 'Colors', icon: 'palette', class: '', claim: 'GetPColorsQuery' }
```

---

### Module 2: Customers

#### Files to Create:
```
core/components/admin/customer/
├── models/
│   └── Customer.ts
├── services/
│   ├── Customer.service.ts
│   └── Customer.service.spec.ts
├── customer.component.ts
├── customer.component.html
├── customer.component.scss
└── customer.component.spec.ts
```

#### Model:
```typescript
export class Customer {
  customerId: number;
  citizenId: string;
  nationalityId: number;
  name: string;
  address: string;
  mobilePhones: string;
}
```

#### API Endpoints:
- `GET /customers/`
- `GET /customers/{id}`
- `POST /customers/`
- `PUT /customers/`
- `DELETE /customers/{id}`
- `GET /customers/lookups`

#### Table Columns:
`['customerId', 'citizenId', 'name', 'address', 'mobilePhones', 'update', 'delete']`

#### Claims:
- `GetCustomersQuery`
- `CreateCustomerCommand`
- `UpdateCustomerCommand`
- `DeleteCustomerCommand`

#### Sidebar Menu:
```typescript
{ path: '/customer', title: 'Customers', icon: 'people', class: '', claim: 'GetCustomersQuery' }
```

---

### Module 3: Products

#### Files to Create:
```
core/components/admin/product/
├── models/
│   └── Product.ts
├── services/
│   ├── Product.service.ts
│   └── Product.service.spec.ts
├── product.component.ts
├── product.component.html
├── product.component.scss
└── product.component.spec.ts
```

#### Model:
```typescript
export class Product {
  productId: number;
  productCode: string;
  productName: string;
  price: number;
  stock: number;
  pColorId: number;
  pColorName?: string; // For display
}
```

#### API Endpoints:
- `GET /products/`
- `GET /products/{id}`
- `POST /products/`
- `PUT /products/`
- `DELETE /products/{id}`
- `GET /products/lookups`

#### Table Columns:
`['productId', 'productCode', 'productName', 'pColorName', 'price', 'stock', 'update', 'delete']`

#### Dropdowns Needed:
- Color dropdown (use `lookUpService.getPColorLookUp()`)

#### Claims:
- `GetProductsQuery`
- `CreateProductCommand`
- `UpdateProductCommand`
- `DeleteProductCommand`

#### Sidebar Menu:
```typescript
{ path: '/product', title: 'Products', icon: 'inventory', class: '', claim: 'GetProductsQuery' }
```

---

### Module 4: Warehouse

#### Files to Create:
```
core/components/admin/warehouse/
├── models/
│   └── Warehouse.ts
├── services/
│   ├── Warehouse.service.ts
│   └── Warehouse.service.spec.ts
├── warehouse.component.ts
├── warehouse.component.html
├── warehouse.component.scss
└── warehouse.component.spec.ts
```

#### Model:
```typescript
export class Warehouse {
  id: number;
  productId: number;
  productName?: string; // For display
  productCode?: string; // For display
  stock: number;
  address: string;
  description: string;
}
```

#### API Endpoints:
- `GET /warehouses/`
- `GET /warehouses/{id}`
- `POST /warehouses/`
- `PUT /warehouses/`
- `DELETE /warehouses/{id}`

#### Table Columns:
`['id', 'productName', 'productCode', 'stock', 'address', 'description', 'update', 'delete']`

#### Dropdowns Needed:
- Product dropdown (use `lookUpService.getProductLookUp()`)

#### Claims:
- `GetWarehousesQuery`
- `CreateWarehouseCommand`
- `UpdateWarehouseCommand`
- `DeleteWarehouseCommand`

#### Sidebar Menu:
```typescript
{ path: '/warehouse', title: 'Warehouse', icon: 'store', class: '', claim: 'GetWarehousesQuery' }
```

---

### Module 5: Orders (Most Complex)

#### Files to Create:
```
core/components/admin/order/
├── models/
│   ├── Order.ts
│   └── OrderDto.ts
├── services/
│   ├── Order.service.ts
│   └── Order.service.spec.ts
├── order.component.ts
├── order.component.html
├── order.component.scss
└── order.component.spec.ts
```

#### Models:
```typescript
export class Order {
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

export class OrderDto {
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

#### API Endpoints:
- `GET /orders/`
- `GET /orders/{id}`
- `POST /orders/`
- `PUT /orders/`
- `DELETE /orders/{id}`
- `GET /orders/dto`

#### Table Columns (use OrderDto):
`['orderId', 'customerName', 'productName', 'quantity', 'price', 'totalPrice', 'status', 'orderDate', 'deliveryDate', 'update', 'delete']`

#### Dropdowns Needed:
- Customer dropdown (use `lookUpService.getCustomerLookUp()`)
- Product dropdown (use `lookUpService.getProductLookUp()`)

#### Claims:
- `GetOrdersQuery`
- `CreateOrderCommand`
- `UpdateOrderCommand`
- `DeleteOrderCommand`

#### Sidebar Menu:
```typescript
{ path: '/order', title: 'Orders', icon: 'shopping_cart', class: '', claim: 'GetOrdersQuery' }
```

---

## 🔧 CONFIGURATION UPDATES

### 1. Routing Configuration
**File:** `core/components/app/layouts/admin-layout/admin-layout.routing.ts`

**Add these imports:**
```typescript
import { PColorComponent } from 'app/core/components/admin/pcolor/pcolor.component';
import { CustomerComponent } from 'app/core/components/admin/customer/customer.component';
import { ProductComponent } from 'app/core/components/admin/product/product.component';
import { OrderComponent } from 'app/core/components/admin/order/order.component';
import { WarehouseComponent } from 'app/core/components/admin/warehouse/warehouse.component';
```

**Add these routes:**
```typescript
export const AdminLayoutRoutes: Routes = [
  // ... existing routes ...
  { path: 'pcolor', component: PColorComponent, canActivate: [LoginGuard] },
  { path: 'customer', component: CustomerComponent, canActivate: [LoginGuard] },
  { path: 'product', component: ProductComponent, canActivate: [LoginGuard] },
  { path: 'order', component: OrderComponent, canActivate: [LoginGuard] },
  { path: 'warehouse', component: WarehouseComponent, canActivate: [LoginGuard] }
];
```

---

### 2. Sidebar Configuration
**File:** `core/components/app/sidebar/sidebar.component.ts`

**Add to ADMINROUTES array:**
```typescript
export const ADMINROUTES: RouteInfo[] = [
  // ... existing routes ...
  { path: '/pcolor', title: 'Colors', icon: 'palette', class: '', claim: 'GetPColorsQuery' },
  { path: '/customer', title: 'Customers', icon: 'people', class: '', claim: 'GetCustomersQuery' },
  { path: '/product', title: 'Products', icon: 'inventory', class: '', claim: 'GetProductsQuery' },
  { path: '/order', title: 'Orders', icon: 'shopping_cart', class: '', claim: 'GetOrdersQuery' },
  { path: '/warehouse', title: 'Warehouse', icon: 'store', class: '', claim: 'GetWarehousesQuery' }
];
```

---

### 3. Module Registration
**File:** `core/modules/admin-layout.module.ts`

**Add imports:**
```typescript
import { PColorComponent } from '../components/admin/pcolor/pcolor.component';
import { CustomerComponent } from '../components/admin/customer/customer.component';
import { ProductComponent } from '../components/admin/product/product.component';
import { OrderComponent } from '../components/admin/order/order.component';
import { WarehouseComponent } from '../components/admin/warehouse/warehouse.component';
```

**Add to declarations:**
```typescript
@NgModule({
  declarations: [
    // ... existing ...
    PColorComponent,
    CustomerComponent,
    ProductComponent,
    OrderComponent,
    WarehouseComponent
  ]
})
```

---

## 📝 TRANSLATION KEYS

### Colors (PColor)
```json
{
  "PColor": "Color",
  "PColors": "Colors",
  "ColorName": "Color Name",
  "ColorCode": "Color Code",
  "AddColor": "Add Color",
  "UpdateColor": "Update Color",
  "DeleteColor": "Delete Color"
}
```

### Customers
```json
{
  "Customer": "Customer",
  "Customers": "Customers",
  "CitizenId": "Citizen ID",
  "NationalityId": "Nationality",
  "CustomerName": "Customer Name",
  "CustomerAddress": "Address",
  "MobilePhones": "Mobile Phones",
  "AddCustomer": "Add Customer",
  "UpdateCustomer": "Update Customer",
  "DeleteCustomer": "Delete Customer"
}
```

### Products
```json
{
  "Product": "Product",
  "Products": "Products",
  "ProductCode": "Product Code",
  "ProductName": "Product Name",
  "Price": "Price",
  "Stock": "Stock",
  "Color": "Color",
  "AddProduct": "Add Product",
  "UpdateProduct": "Update Product",
  "DeleteProduct": "Delete Product"
}
```

### Orders
```json
{
  "Order": "Order",
  "Orders": "Orders",
  "OrderDate": "Order Date",
  "DeliveryDate": "Delivery Date",
  "Quantity": "Quantity",
  "TotalPrice": "Total Price",
  "OrderStatus": "Status",
  "AddOrder": "Add Order",
  "UpdateOrder": "Update Order",
  "DeleteOrder": "Delete Order"
}
```

### Warehouse
```json
{
  "Warehouse": "Warehouse",
  "Warehouses": "Warehouses",
  "WarehouseAddress": "Warehouse Address",
  "WarehouseDescription": "Description",
  "AddWarehouse": "Add Warehouse",
  "UpdateWarehouse": "Update Warehouse",
  "DeleteWarehouse": "Delete Warehouse"
}
```

---

## ✅ STANDARD SERVICE TEMPLATE

```typescript
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../../../environments/environment";
import { ModuleName } from "../models/module-name";

@Injectable({
  providedIn: "root",
})
export class ModuleNameService {
  constructor(private httpClient: HttpClient) {}

  getList(): Observable<ModuleName[]> {
    return this.httpClient.get<ModuleName[]>(environment.getApiUrl + "/endpoint/");
  }

  getById(id: number): Observable<ModuleName> {
    return this.httpClient.get<ModuleName>(environment.getApiUrl + `/endpoint/${id}`);
  }

  add(item: ModuleName): Observable<any> {
    return this.httpClient.post(
      environment.getApiUrl + "/endpoint/",
      item,
      { responseType: "text" }
    );
  }

  update(item: ModuleName): Observable<any> {
    return this.httpClient.put(
      environment.getApiUrl + "/endpoint/",
      item,
      { responseType: "text" }
    );
  }

  delete(id: number): Observable<any> {
    return this.httpClient.request(
      "delete",
      environment.getApiUrl + `/endpoint/${id}`
    );
  }
}
```

---

## 🎯 DEVELOPMENT ORDER (RECOMMENDED)

1. ✅ **Colors (PColor)** - Simplest, no dependencies
2. ✅ **Customers** - Foundation for orders
3. ✅ **Products** - Depends on colors
4. ✅ **Warehouse** - Depends on products
5. ✅ **Orders** - Most complex, depends on customers and products

---

## 📊 EFFORT ESTIMATION

| Module | Complexity | Estimated Time |
|--------|-----------|---------------|
| Colors | Low | 3-4 hours |
| Customers | Low | 3-4 hours |
| Products | Medium | 4-5 hours |
| Warehouse | Medium | 4-5 hours |
| Orders | High | 6-8 hours |
| **Integration & Testing** | - | 8-10 hours |
| **TOTAL** | - | **28-36 hours** |

---

## 🔍 TESTING CHECKLIST (Per Module)

- [ ] CRUD operations work correctly
- [ ] Form validation works
- [ ] Table pagination works
- [ ] Table sorting works
- [ ] Table filtering works
- [ ] Dropdowns populate correctly
- [ ] Modal open/close works
- [ ] Success/error messages display
- [ ] Claims/permissions restrict access
- [ ] Translations work (EN/TR)
- [ ] Responsive design works
- [ ] No console errors

---

*Last Updated: October 10, 2025*

