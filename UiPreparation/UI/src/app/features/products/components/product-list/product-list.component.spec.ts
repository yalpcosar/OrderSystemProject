import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../../core/components/admin/product/services/Product.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';
import { ProductWithStock } from '../../../../core/models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockAlertifyService: jasmine.SpyObj<AlertifyService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockProducts: ProductWithStock[] = [
    {
      id: 1,
      name: 'Test Product 1',
      colorId: 1,
      colorName: 'Red',
      size: 1,
      quantity: 10,
      isAvailableForSale: true,
      status: true
    },
    {
      id: 2,
      name: 'Test Product 2',
      colorId: 2,
      colorName: 'Blue',
      size: 2,
      quantity: 0,
      isAvailableForSale: false,
      status: true
    }
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductsWithStock', 'deleteProduct']);
    const alertifyServiceSpy = jasmine.createSpyObj('AlertifyService', ['error', 'success', 'confirm']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['claimGuard']);

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        SweetAlert2Module.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: AlertifyService, useValue: alertifyServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    mockProductService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    mockAlertifyService = TestBed.inject(AlertifyService) as jasmine.SpyObj<AlertifyService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Setup default mock returns
    mockAuthService.claimGuard.and.returnValue(true);
    mockProductService.getProductsWithStock.and.returnValue(of(mockProducts));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    component.ngOnInit();
    expect(mockProductService.getProductsWithStock).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockProducts);
  });

  it('should check authorization on init', () => {
    component.ngOnInit();
    expect(mockAuthService.claimGuard).toHaveBeenCalledWith('GetProductQuery');
  });

  it('should navigate to add product when user has permission', () => {
    spyOn(component['router'], 'navigate');
    mockAuthService.claimGuard.and.returnValue(true);
    
    component.addProduct();
    
    expect(component['router'].navigate).toHaveBeenCalledWith(['/products/add']);
  });

  it('should show error when user lacks permission to add product', () => {
    mockAuthService.claimGuard.and.returnValue(false);
    
    component.addProduct();
    
    expect(mockAlertifyService.error).toHaveBeenCalledWith('You do not have permission to add products');
  });

  it('should navigate to edit product when user has permission', () => {
    spyOn(component['router'], 'navigate');
    mockAuthService.claimGuard.and.returnValue(true);
    
    component.editProduct(mockProducts[0]);
    
    expect(component['router'].navigate).toHaveBeenCalledWith(['/products/edit', mockProducts[0].id]);
  });

  it('should show error when user lacks permission to edit product', () => {
    mockAuthService.claimGuard.and.returnValue(false);
    
    component.editProduct(mockProducts[0]);
    
    expect(mockAlertifyService.error).toHaveBeenCalledWith('You do not have permission to edit products');
  });

  it('should get correct size display name', () => {
    expect(component.getSizeDisplayName(1)).toBe('S');
    expect(component.getSizeDisplayName(2)).toBe('M');
    expect(component.getSizeDisplayName(3)).toBe('L');
    expect(component.getSizeDisplayName(4)).toBe('XL');
    expect(component.getSizeDisplayName(5)).toBe('Unknown');
  });

  it('should get correct stock status class', () => {
    expect(component.getStockStatusClass(10, true)).toBe('in-stock');
    expect(component.getStockStatusClass(5, true)).toBe('low-stock');
    expect(component.getStockStatusClass(0, true)).toBe('out-of-stock');
    expect(component.getStockStatusClass(10, false)).toBe('unavailable');
  });

  it('should get correct stock status text', () => {
    expect(component.getStockStatusText(10, true)).toBe('In Stock');
    expect(component.getStockStatusText(5, true)).toBe('Low Stock');
    expect(component.getStockStatusText(0, true)).toBe('Out of Stock');
    expect(component.getStockStatusText(10, false)).toBe('Unavailable');
  });

  it('should apply filter correctly', () => {
    const event = { target: { value: 'test' } } as any;
    component.dataSource.data = mockProducts;
    
    component.applyFilter(event);
    
    expect(component.dataSource.filter).toBe('test');
  });
});
