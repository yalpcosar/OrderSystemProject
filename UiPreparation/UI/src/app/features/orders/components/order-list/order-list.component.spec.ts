import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { OrderListComponent } from './order-list.component';
import { OrderService } from '../../../../core/components/admin/order/services/Order.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlertifyService: jasmine.SpyObj<AlertifyService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockOrders = [
    {
      orderId: 1,
      orderDate: new Date('2024-01-01'),
      customerName: 'John Doe',
      productName: 'Test Product',
      productCode: 'PROD001',
      quantity: 5,
      price: 100,
      totalPrice: 500,
      status: 'Active',
      deliveryDate: new Date('2024-01-02')
    }
  ];

  beforeEach(async () => {
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['getOrderList', 'deleteOrder']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const alertifyServiceSpy = jasmine.createSpyObj('AlertifyService', ['error', 'success', 'confirm']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['claimGuard']);

    await TestBed.configureTestingModule({
      declarations: [OrderListComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertifyService, useValue: alertifyServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    mockOrderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockAlertifyService = TestBed.inject(AlertifyService) as jasmine.SpyObj<AlertifyService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    mockAuthService.claimGuard.and.returnValue(true);
    mockOrderService.getOrderList.and.returnValue(of(mockOrders));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    component.ngOnInit();
    expect(mockOrderService.getOrderList).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockOrders);
  });

  it('should navigate to add order page', () => {
    component.onAddOrder();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/orders/add']);
  });

  it('should navigate to edit order page', () => {
    const order = mockOrders[0];
    component.onEditOrder(order);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/orders/edit', order.orderId]);
  });

  it('should delete order successfully', () => {
    const order = mockOrders[0];
    mockOrderService.deleteOrder.and.returnValue(of({}));
    mockAlertifyService.confirm.and.callFake((title, message, callback) => callback());

    component.onDeleteOrder(order);

    expect(mockOrderService.deleteOrder).toHaveBeenCalledWith(order.orderId);
    expect(mockAlertifyService.success).toHaveBeenCalledWith('Order deleted successfully');
  });

  it('should handle delete order error', () => {
    const order = mockOrders[0];
    mockOrderService.deleteOrder.and.returnValue(throwError('Error'));
    mockAlertifyService.confirm.and.callFake((title, message, callback) => callback());

    component.onDeleteOrder(order);

    expect(mockAlertifyService.error).toHaveBeenCalledWith('Failed to delete order');
  });

  it('should apply filter correctly', () => {
    const event = { target: { value: 'ORD001' } } as any;
    component.dataSource.data = mockOrders;
    component.ngOnInit();

    component.applyFilter(event);

    expect(component.dataSource.filter).toBe('ord001');
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('Active')).toBe('status-active');
    expect(component.getStatusClass('Inactive')).toBe('status-inactive');
  });

  it('should redirect if user does not have permission', () => {
    mockAuthService.claimGuard.and.returnValue(false);
    
    component.ngOnInit();

    expect(mockAlertifyService.error).toHaveBeenCalledWith('You do not have permission to access this page');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
