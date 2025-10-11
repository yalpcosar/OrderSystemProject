import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { OrderFormComponent } from './order-form.component';
import { OrderService } from '../../../../core/components/admin/order/services/Order.service';
import { CustomerService } from '../../../../core/components/admin/customer/services/Customer.service';
import { ProductService } from '../../../../core/components/admin/product/services/Product.service';
import { WarehouseService } from '../../../../core/components/admin/warehouse/services/Warehouse.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';

describe('OrderFormComponent', () => {
  let component: OrderFormComponent;
  let fixture: ComponentFixture<OrderFormComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockCustomerService: jasmine.SpyObj<CustomerService>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockWarehouseService: jasmine.SpyObj<WarehouseService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlertifyService: jasmine.SpyObj<AlertifyService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockCustomers = [
    { 
      id: 1, 
      customerName: 'John Doe', 
      customerCode: 'CUST001',
      address: '123 Main St',
      phoneNumber: '555-0123',
      email: 'john@example.com',
      createdUserId: 1,
      createdDate: new Date(),
      lastUpdatedUserId: 1,
      lastUpdatedDate: new Date(),
      status: true,
      isDeleted: false
    },
    { 
      id: 2, 
      customerName: 'Jane Smith', 
      customerCode: 'CUST002',
      address: '456 Oak Ave',
      phoneNumber: '555-0456',
      email: 'jane@example.com',
      createdUserId: 1,
      createdDate: new Date(),
      lastUpdatedUserId: 1,
      lastUpdatedDate: new Date(),
      status: true,
      isDeleted: false
    }
  ];

  const mockProducts = [
    { productId: 1, productName: 'Test Product 1', pColorName: 'Red', productCode: 'PROD001', price: 100, stock: 50, pColorId: 1 },
    { productId: 2, productName: 'Test Product 2', pColorName: 'Blue', productCode: 'PROD002', price: 150, stock: 30, pColorId: 2 }
  ];

  const mockOrder = {
    orderId: 1,
    customerId: 1,
    productId: 1,
    quantity: 5,
    price: 100,
    status: 1,
    orderDate: new Date(),
    deliveryDate: new Date()
  };

  const mockStockResponse = {
    isAvailable: true,
    availableQuantity: 10,
    message: 'Stock available'
  };

  beforeEach(async () => {
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['getOrderById', 'addOrder', 'updateOrder']);
    const customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getCustomerList']);
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductsWithStock']);
    const warehouseServiceSpy = jasmine.createSpyObj('WarehouseService', ['checkAvailability']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const alertifyServiceSpy = jasmine.createSpyObj('AlertifyService', ['error', 'success']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['claimGuard']);

    await TestBed.configureTestingModule({
      declarations: [OrderFormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: CustomerService, useValue: customerServiceSpy },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: WarehouseService, useValue: warehouseServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertifyService, useValue: alertifyServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({ id: null }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderFormComponent);
    component = fixture.componentInstance;
    mockOrderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    mockCustomerService = TestBed.inject(CustomerService) as jasmine.SpyObj<CustomerService>;
    mockProductService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    mockWarehouseService = TestBed.inject(WarehouseService) as jasmine.SpyObj<WarehouseService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockAlertifyService = TestBed.inject(AlertifyService) as jasmine.SpyObj<AlertifyService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    mockAuthService.claimGuard.and.returnValue(true);
    mockCustomerService.getCustomerList.and.returnValue(of(mockCustomers));
    mockProductService.getProductsWithStock.and.returnValue(of(mockProducts));
    mockWarehouseService.checkAvailability.and.returnValue(of(mockStockResponse));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required validators', () => {
    component.ngOnInit();
    expect(component.orderForm.get('customerId')?.hasError('required')).toBeTruthy();
    expect(component.orderForm.get('productId')?.hasError('required')).toBeTruthy();
    expect(component.orderForm.get('quantity')?.hasError('required')).toBeTruthy();
  });

  it('should load customers and products on init', () => {
    component.ngOnInit();
    expect(mockCustomerService.getCustomerList).toHaveBeenCalled();
    expect(mockProductService.getProductsWithStock).toHaveBeenCalled();
  });

  it('should check stock availability when product and quantity change', () => {
    component.ngOnInit();
    component.orderForm.patchValue({
      productId: 1,
      quantity: 5
    });

    // Trigger the debounced stock check
    setTimeout(() => {
      expect(mockWarehouseService.checkAvailability).toHaveBeenCalledWith(1, 5);
    }, 400);
  });

  it('should disable submit button when stock is unavailable', () => {
    component.ngOnInit();
    component.orderForm.patchValue({
      customerId: 1,
      productId: 1,
      quantity: 5
    });
    component.stockAvailability.isAvailable = false;

    expect(component.isSubmitDisabled()).toBeTruthy();
  });

  it('should enable submit button when stock is available and form is valid', () => {
    component.ngOnInit();
    component.orderForm.patchValue({
      customerId: 1,
      productId: 1,
      quantity: 5
    });
    component.stockAvailability.isAvailable = true;

    expect(component.isSubmitDisabled()).toBeFalsy();
  });

  it('should create order successfully', () => {
    component.ngOnInit();
    component.orderForm.patchValue({
      customerId: 1,
      productId: 1,
      quantity: 5
    });
    component.stockAvailability.isAvailable = true;
    mockOrderService.addOrder.and.returnValue(of({}));

    component.onSubmit();

    expect(mockOrderService.addOrder).toHaveBeenCalled();
    expect(mockAlertifyService.success).toHaveBeenCalledWith('Order created successfully');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/orders']);
  });

  it('should update order successfully in edit mode', () => {
    component.isEditMode = true;
    component.orderId = 1;
    component.ngOnInit();
    component.orderForm.patchValue({
      customerId: 1,
      productId: 1,
      quantity: 5
    });
    component.stockAvailability.isAvailable = true;
    mockOrderService.updateOrder.and.returnValue(of({}));

    component.onSubmit();

    expect(mockOrderService.updateOrder).toHaveBeenCalled();
    expect(mockAlertifyService.success).toHaveBeenCalledWith('Order updated successfully');
  });

  it('should prevent submission when stock is unavailable', () => {
    component.ngOnInit();
    component.orderForm.patchValue({
      customerId: 1,
      productId: 1,
      quantity: 5
    });
    component.stockAvailability.isAvailable = false;

    component.onSubmit();

    expect(mockOrderService.addOrder).not.toHaveBeenCalled();
  });

  it('should handle stock check error', () => {
    component.ngOnInit();
    mockWarehouseService.checkAvailability.and.returnValue(throwError('Error'));
    
    component.orderForm.patchValue({
      productId: 1,
      quantity: 5
    });

    setTimeout(() => {
      expect(component.stockAvailability.isAvailable).toBeFalsy();
      expect(component.stockAvailability.message).toBe('Unable to check stock availability');
    }, 400);
  });

  it('should redirect if user does not have permission', () => {
    mockAuthService.claimGuard.and.returnValue(false);
    
    component.ngOnInit();

    expect(mockAlertifyService.error).toHaveBeenCalledWith('You do not have permission to access this page');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/orders']);
  });

  it('should return correct stock status class', () => {
    component.stockAvailability.isAvailable = true;
    expect(component.getStockStatusClass()).toBe('stock-available');

    component.stockAvailability.isAvailable = false;
    expect(component.getStockStatusClass()).toBe('stock-unavailable');

    component.isCheckingStock = true;
    expect(component.getStockStatusClass()).toBe('stock-checking');
  });

  it('should return correct stock status icon', () => {
    component.stockAvailability.isAvailable = true;
    expect(component.getStockStatusIcon()).toBe('check_circle');

    component.stockAvailability.isAvailable = false;
    expect(component.getStockStatusIcon()).toBe('error');

    component.isCheckingStock = true;
    expect(component.getStockStatusIcon()).toBe('hourglass_empty');
  });
});
