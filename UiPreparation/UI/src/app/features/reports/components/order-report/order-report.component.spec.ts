import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { OrderReportComponent } from './order-report.component';
import { OrderService } from '../../../../core/components/admin/order/services/Order.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';

describe('OrderReportComponent', () => {
  let component: OrderReportComponent;
  let fixture: ComponentFixture<OrderReportComponent>;
  let orderService: jasmine.SpyObj<OrderService>;
  let alertifyService: jasmine.SpyObj<AlertifyService>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockOrderData = [
    {
      orderId: 1,
      orderDate: '2023-01-01',
      customerName: 'John Doe',
      productName: 'Test Product',
      productCode: 'TP001',
      color: 'Red',
      size: 'M',
      quantity: 5,
      status: 'Active',
      price: 10.00,
      totalPrice: 50.00
    },
    {
      orderId: 2,
      orderDate: '2023-01-02',
      customerName: 'Jane Smith',
      productName: 'Test Product 2',
      productCode: 'TP002',
      color: 'Blue',
      size: 'L',
      quantity: 3,
      status: 'Pending',
      price: 15.00,
      totalPrice: 45.00
    }
  ];

  beforeEach(async () => {
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['getOrderReport']);
    const alertifyServiceSpy = jasmine.createSpyObj('AlertifyService', ['error', 'success']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['claimGuard']);

    await TestBed.configureTestingModule({
      declarations: [OrderReportComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: AlertifyService, useValue: alertifyServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderReportComponent);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    alertifyService = TestBed.inject(AlertifyService) as jasmine.SpyObj<AlertifyService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Setup default mocks
    authService.claimGuard.and.returnValue(true);
    orderService.getOrderReport.and.returnValue(of({ data: mockOrderData }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty data source', () => {
    expect(component.dataSource).toBeDefined();
    expect(component.dataSource.data).toEqual([]);
  });

  it('should create filter form with correct controls', () => {
    expect(component.filterForm).toBeDefined();
    expect(component.filterForm.get('startDate')).toBeDefined();
    expect(component.filterForm.get('endDate')).toBeDefined();
    expect(component.filterForm.get('searchTerm')).toBeDefined();
    expect(component.filterForm.get('status')).toBeDefined();
  });

  it('should load order report on init', () => {
    component.ngOnInit();
    expect(orderService.getOrderReport).toHaveBeenCalled();
  });

  it('should transform order data correctly', () => {
    const transformedData = component.transformOrderData(mockOrderData);
    expect(transformedData.length).toBe(2);
    expect(transformedData[0].orderId).toBe(1);
    expect(transformedData[0].orderDate).toEqual(new Date('2023-01-01'));
    expect(transformedData[0].customerName).toBe('John Doe');
  });

  it('should calculate summary statistics correctly', () => {
    const testData = [
      { quantity: 5, totalPrice: 50.00 } as any,
      { quantity: 3, totalPrice: 45.00 } as any
    ];
    
    component.calculateSummary(testData);
    
    expect(component.summary.totalOrders).toBe(2);
    expect(component.summary.totalQuantity).toBe(8);
    expect(component.summary.totalRevenue).toBe(95.00);
  });

  it('should apply filters when applyFilters is called', () => {
    component.filterForm.patchValue({
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-31')
    });
    
    component.applyFilters();
    
    expect(orderService.getOrderReport).toHaveBeenCalledWith('2023-01-01', '2023-01-31');
  });

  it('should clear filters when clearFilters is called', () => {
    component.filterForm.patchValue({
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-31'),
      searchTerm: 'test',
      status: 'Active'
    });
    
    component.clearFilters();
    
    expect(component.filterForm.get('startDate')?.value).toBeNull();
    expect(component.filterForm.get('endDate')?.value).toBeNull();
    expect(component.filterForm.get('searchTerm')?.value).toBeNull();
    expect(component.filterForm.get('status')?.value).toBeNull();
  });

  it('should handle error when loading order report fails', () => {
    orderService.getOrderReport.and.returnValue(throwError('Error loading report'));
    
    component.loadOrderReport();
    
    expect(alertifyService.error).toHaveBeenCalledWith('Failed to load order report');
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(123.45);
    expect(formatted).toBe('$123.45');
  });

  it('should format date correctly', () => {
    const testDate = new Date('2023-01-15');
    const formatted = component.formatDate(testDate);
    expect(formatted).toBe('Jan 15, 2023');
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('Active')).toBe('status-active');
    expect(component.getStatusClass('Pending')).toBe('status-pending');
    expect(component.getStatusClass('Cancelled')).toBe('status-cancelled');
    expect(component.getStatusClass('Unknown')).toBe('status-default');
  });

  it('should show error message when user lacks authorization', () => {
    authService.claimGuard.and.returnValue(false);
    
    component.checkAuthorization();
    
    expect(alertifyService.error).toHaveBeenCalledWith('You do not have permission to access this page');
  });

  it('should export to Excel', () => {
    component.exportToExcel();
    expect(alertifyService.success).toHaveBeenCalledWith('Export functionality will be implemented');
  });

  it('should export to PDF', () => {
    component.exportToPDF();
    expect(alertifyService.success).toHaveBeenCalledWith('Export functionality will be implemented');
  });
});
