import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ProductFormComponent } from './product-form.component';
import { SizeEnum } from '../../../../core/enums/size.enum';
import { ProductService } from '../../../../core/components/admin/product/services/Product.service';
import { PColorService } from '../../../../core/components/admin/pcolor/services/PColor.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';
import { Product } from '../../../../core/models/product.model';
import { Color } from '../../../../core/models/color.model';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockColorService: jasmine.SpyObj<PColorService>;
  let mockAlertifyService: jasmine.SpyObj<AlertifyService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockColors: Color[] = [
    { id: 1, name: 'Red', hexCode: '#FF0000', createdUserId: 0, createdDate: new Date(), lastUpdatedUserId: 0, lastUpdatedDate: new Date(), status: true, isDeleted: false },
    { id: 2, name: 'Blue', hexCode: '#0000FF', createdUserId: 0, createdDate: new Date(), lastUpdatedUserId: 0, lastUpdatedDate: new Date(), status: true, isDeleted: false }
  ];

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    colorId: 1,
    size: SizeEnum.M,
    createdUserId: 0,
    createdDate: new Date(),
    lastUpdatedUserId: 0,
    lastUpdatedDate: new Date(),
    status: true,
    isDeleted: false
  };

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductById', 'addProduct', 'updateProduct']);
    const colorServiceSpy = jasmine.createSpyObj('PColorService', ['getColorList']);
    const alertifyServiceSpy = jasmine.createSpyObj('AlertifyService', ['error', 'success']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['claimGuard']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        SweetAlert2Module.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: PColorService, useValue: colorServiceSpy },
        { provide: AlertifyService, useValue: alertifyServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    mockProductService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    mockColorService = TestBed.inject(PColorService) as jasmine.SpyObj<PColorService>;
    mockAlertifyService = TestBed.inject(AlertifyService) as jasmine.SpyObj<AlertifyService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    // Setup default mock returns
    mockAuthService.claimGuard.and.returnValue(true);
    mockColorService.getColorList.and.returnValue(of(mockColors));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with validators', () => {
    component.ngOnInit();
    expect(component.productForm.get('name')?.hasError('required')).toBeTruthy();
    expect(component.productForm.get('colorId')?.hasError('required')).toBeTruthy();
    expect(component.productForm.get('size')?.hasError('required')).toBeTruthy();
  });

  it('should load colors on init', () => {
    component.ngOnInit();
    expect(mockColorService.getColorList).toHaveBeenCalled();
    expect(component.colors).toEqual(mockColors);
  });

  it('should check authorization on init', () => {
    component.ngOnInit();
    expect(mockAuthService.claimGuard).toHaveBeenCalledWith('AddProductCommand');
  });

  it('should create product when form is valid and not in edit mode', () => {
    spyOn(component['router'], 'navigate');
    mockProductService.addProduct.and.returnValue(of({}));
    
    component.productForm.patchValue({
      name: 'Test Product',
      colorId: 1,
      size: SizeEnum.M
    });
    
    component.onSubmit();
    
    expect(mockProductService.addProduct).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Test Product',
      colorId: 1,
      size: SizeEnum.M
    }));
    expect(mockAlertifyService.success).toHaveBeenCalledWith('Product created successfully');
    expect(component['router'].navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should update product when form is valid and in edit mode', () => {
    spyOn(component['router'], 'navigate');
    component.isEditMode = true;
    component.productId = 1;
    mockProductService.updateProduct.and.returnValue(of({}));
    
    component.productForm.patchValue({
      name: 'Updated Product',
      colorId: 2,
      size: SizeEnum.L
    });
    
    component.onSubmit();
    
    expect(mockProductService.updateProduct).toHaveBeenCalledWith(jasmine.objectContaining({
      id: 1,
      name: 'Updated Product',
      colorId: 2,
      size: SizeEnum.L
    }));
    expect(mockAlertifyService.success).toHaveBeenCalledWith('Product updated successfully');
    expect(component['router'].navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should not submit when form is invalid', () => {
    spyOn(component, 'markFormGroupTouched');
    
    component.onSubmit();
    
    expect(component.markFormGroupTouched).toHaveBeenCalled();
    expect(mockProductService.addProduct).not.toHaveBeenCalled();
  });

  it('should open color dialog', () => {
    const mockDialogRef = { afterClosed: () => of(true) };
    mockDialog.open.and.returnValue(mockDialogRef as any);
    spyOn(component, 'loadColors');
    
    component.openColorDialog();
    
    expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
      width: '600px',
      maxHeight: '80vh',
      disableClose: false
    });
  });

  it('should get correct error message for required field', () => {
    component.productForm.get('name')?.markAsTouched();
    expect(component.getErrorMessage('name')).toBe('name is required');
  });

  it('should get correct error message for minlength', () => {
    component.productForm.patchValue({ name: 'A' });
    component.productForm.get('name')?.markAsTouched();
    expect(component.getErrorMessage('name')).toBe('name must be at least 2 characters');
  });

  it('should return true for invalid field', () => {
    component.productForm.get('name')?.markAsTouched();
    expect(component.isFieldInvalid('name')).toBeTruthy();
  });

  it('should return false for valid field', () => {
    component.productForm.patchValue({ name: 'Valid Name' });
    component.productForm.get('name')?.markAsTouched();
    expect(component.isFieldInvalid('name')).toBeFalsy();
  });

  it('should navigate back on cancel', () => {
    spyOn(component['router'], 'navigate');
    
    component.onCancel();
    
    expect(component['router'].navigate).toHaveBeenCalledWith(['/products']);
  });
});
