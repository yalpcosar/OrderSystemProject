import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { WarehouseReportComponent } from './warehouse-report.component';
import { WarehouseService } from '../../../../core/components/admin/warehouse/services/Warehouse.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';
import { WarehouseItem, WarehouseReport } from '../../../../core/models/warehouse.model';

describe('WarehouseReportComponent', () => {
  let component: WarehouseReportComponent;
  let fixture: ComponentFixture<WarehouseReportComponent>;
  let mockWarehouseService: jasmine.SpyObj<WarehouseService>;
  let mockAlertifyService: jasmine.SpyObj<AlertifyService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockWarehouseReport: WarehouseReport = {
    items: [
      {
        productId: 1,
        productName: 'Test Product 1',
        colorName: 'Red',
        size: 1,
        quantity: 50,
        isAvailableForSale: true
      },
      {
        productId: 2,
        productName: 'Test Product 2',
        colorName: 'Blue',
        size: 2,
        quantity: 0,
        isAvailableForSale: false
      }
    ],
    totalProducts: 2,
    totalQuantity: 50,
    availableForSale: 1,
    outOfStock: 1
  };

  beforeEach(async () => {
    const warehouseServiceSpy = jasmine.createSpyObj('WarehouseService', ['getWarehouseReport']);
    const alertifyServiceSpy = jasmine.createSpyObj('AlertifyService', ['error', 'success', 'warning']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['loggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [WarehouseReportComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatCardModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        FormsModule,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: WarehouseService, useValue: warehouseServiceSpy },
        { provide: AlertifyService, useValue: alertifyServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseReportComponent);
    component = fixture.componentInstance;
    mockWarehouseService = TestBed.inject(WarehouseService) as jasmine.SpyObj<WarehouseService>;
    mockAlertifyService = TestBed.inject(AlertifyService) as jasmine.SpyObj<AlertifyService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    mockAuthService.loggedIn.and.returnValue(true);
    mockWarehouseService.getWarehouseReport.and.returnValue(of(mockWarehouseReport));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load warehouse report on init', () => {
    component.ngOnInit();
    
    expect(mockWarehouseService.getWarehouseReport).toHaveBeenCalled();
    expect(component.warehouseReport).toEqual(mockWarehouseReport);
    expect(component.dataSource.data).toEqual(mockWarehouseReport.items);
  });

  it('should redirect to login if user is not authenticated', () => {
    mockAuthService.loggedIn.and.returnValue(false);
    
    component.ngOnInit();
    
    expect(mockAlertifyService.error).toHaveBeenCalledWith('You must be logged in to access this page');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error when loading warehouse report fails', () => {
    const error = new Error('Test error');
    mockWarehouseService.getWarehouseReport.and.returnValue(throwError(() => error));
    
    component.loadWarehouseReport();
    
    expect(mockAlertifyService.error).toHaveBeenCalledWith('Failed to load warehouse report');
    expect(component.isLoading).toBeFalse();
  });

  it('should apply search filter correctly', () => {
    component.warehouseReport = mockWarehouseReport;
    component.dataSource.data = mockWarehouseReport.items;
    component.searchTerm = 'Test Product 1';
    
    component.applyFilter();
    
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].productName).toBe('Test Product 1');
  });

  it('should apply availability filter correctly', () => {
    component.warehouseReport = mockWarehouseReport;
    component.dataSource.data = mockWarehouseReport.items;
    component.availabilityFilter = 'available';
    
    component.applyFilter();
    
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].isAvailableForSale).toBeTrue();
  });

  it('should get correct stock level class', () => {
    expect(component.getStockLevelClass(0)).toBe('stock-out');
    expect(component.getStockLevelClass(5)).toBe('stock-low');
    expect(component.getStockLevelClass(25)).toBe('stock-medium');
    expect(component.getStockLevelClass(100)).toBe('stock-high');
  });

  it('should get correct stock level text', () => {
    expect(component.getStockLevelText(0)).toBe('Out of Stock');
    expect(component.getStockLevelText(5)).toBe('Low Stock');
    expect(component.getStockLevelText(25)).toBe('Medium Stock');
    expect(component.getStockLevelText(100)).toBe('High Stock');
  });

  it('should get correct availability status', () => {
    const availableItem: WarehouseItem = {
      productId: 1,
      productName: 'Test',
      colorName: 'Red',
      size: 1,
      quantity: 10,
      isAvailableForSale: true
    };

    const unavailableItem: WarehouseItem = {
      productId: 2,
      productName: 'Test',
      colorName: 'Blue',
      size: 2,
      quantity: 10,
      isAvailableForSale: false
    };

    const outOfStockItem: WarehouseItem = {
      productId: 3,
      productName: 'Test',
      colorName: 'Green',
      size: 3,
      quantity: 0,
      isAvailableForSale: true
    };

    expect(component.getAvailabilityStatus(availableItem)).toBe('Available');
    expect(component.getAvailabilityStatus(unavailableItem)).toBe('Unavailable');
    expect(component.getAvailabilityStatus(outOfStockItem)).toBe('Out of Stock');
  });

  it('should get correct availability class', () => {
    const availableItem: WarehouseItem = {
      productId: 1,
      productName: 'Test',
      colorName: 'Red',
      size: 1,
      quantity: 10,
      isAvailableForSale: true
    };

    const unavailableItem: WarehouseItem = {
      productId: 2,
      productName: 'Test',
      colorName: 'Blue',
      size: 2,
      quantity: 10,
      isAvailableForSale: false
    };

    const outOfStockItem: WarehouseItem = {
      productId: 3,
      productName: 'Test',
      colorName: 'Green',
      size: 3,
      quantity: 0,
      isAvailableForSale: true
    };

    expect(component.getAvailabilityClass(availableItem)).toBe('status-available');
    expect(component.getAvailabilityClass(unavailableItem)).toBe('status-unavailable');
    expect(component.getAvailabilityClass(outOfStockItem)).toBe('status-out-of-stock');
  });

  it('should export CSV successfully', () => {
    component.dataSource.data = mockWarehouseReport.items;
    spyOn(window.URL, 'createObjectURL').and.returnValue('mock-url');
    spyOn(window.URL, 'revokeObjectURL');
    
    const createElementSpy = spyOn(document, 'createElement').and.returnValue({
      href: '',
      download: '',
      click: jasmine.createSpy()
    } as any);
    
    component.exportToCSV();
    
    expect(mockAlertifyService.success).toHaveBeenCalledWith('Warehouse report exported successfully');
  });

  it('should show warning when trying to export empty data', () => {
    component.dataSource.data = [];
    
    component.exportToCSV();
    
    expect(mockAlertifyService.warning).toHaveBeenCalledWith('No data to export');
  });

  it('should refresh report', () => {
    spyOn(component, 'loadWarehouseReport');
    
    component.refreshReport();
    
    expect(component.loadWarehouseReport).toHaveBeenCalled();
  });
});
