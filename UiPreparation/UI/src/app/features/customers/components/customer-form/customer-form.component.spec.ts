import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { CustomerFormComponent } from './customer-form.component';
import { CustomerService } from '../../../../core/components/admin/customer/services/Customer.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';

describe('CustomerFormComponent', () => {
  let component: CustomerFormComponent;
  let fixture: ComponentFixture<CustomerFormComponent>;
  let mockCustomerService: jasmine.SpyObj<CustomerService>;
  let mockAlertifyService: jasmine.SpyObj<AlertifyService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getCustomerById', 'addCustomer', 'updateCustomer']);
    const alertifyServiceSpy = jasmine.createSpyObj('AlertifyService', ['success', 'error']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['claimGuard']);

    await TestBed.configureTestingModule({
      declarations: [CustomerFormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        { provide: CustomerService, useValue: customerServiceSpy },
        { provide: AlertifyService, useValue: alertifyServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;
    mockCustomerService = TestBed.inject(CustomerService) as jasmine.SpyObj<CustomerService>;
    mockAlertifyService = TestBed.inject(AlertifyService) as jasmine.SpyObj<AlertifyService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Setup default mock behavior
    mockAuthService.claimGuard.and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create customer form with required validators', () => {
    component.createCustomerForm();
    
    expect(component.customerForm.get('customerName')?.hasError('required')).toBeTruthy();
    expect(component.customerForm.get('customerCode')?.hasError('required')).toBeTruthy();
    expect(component.customerForm.get('phoneNumber')?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    component.createCustomerForm();
    const emailControl = component.customerForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate phone number format', () => {
    component.createCustomerForm();
    const phoneControl = component.customerForm.get('phoneNumber');
    
    phoneControl?.setValue('invalid-phone');
    expect(phoneControl?.hasError('pattern')).toBeTruthy();
    
    phoneControl?.setValue('1234567890');
    expect(phoneControl?.hasError('pattern')).toBeFalsy();
  });

  it('should load customer data in edit mode', () => {
    const mockCustomer = {
      id: 1,
      customerName: 'Test Customer',
      customerCode: 'TC001',
      email: 'test@test.com',
      phoneNumber: '1234567890',
      address: 'Test Address',
      status: true,
      isDeleted: false,
      createdUserId: 1,
      createdDate: new Date(),
      lastUpdatedUserId: 1,
      lastUpdatedDate: new Date()
    };
    
    mockCustomerService.getCustomerById.and.returnValue(of(mockCustomer));
    
    // Simulate edit mode
    component.isEditMode = true;
    component.customerId = 1;
    component.loadCustomer();
    
    expect(mockCustomerService.getCustomerById).toHaveBeenCalledWith(1);
    expect(component.customerForm.get('customerName')?.value).toBe('Test Customer');
  });

  it('should check authorization on init', () => {
    component.ngOnInit();
    expect(mockAuthService.claimGuard).toHaveBeenCalledWith('AddCustomerCommand');
  });

  it('should add customer when form is valid', () => {
    const mockCustomer = {
      id: 0,
      customerName: 'New Customer',
      customerCode: 'NC001',
      email: 'new@test.com',
      phoneNumber: '1234567890',
      address: 'New Address',
      status: true,
      isDeleted: false,
      createdUserId: 0,
      createdDate: new Date(),
      lastUpdatedUserId: 0,
      lastUpdatedDate: new Date()
    };
    
    mockCustomerService.addCustomer.and.returnValue(of('success'));
    mockAuthService.claimGuard.and.returnValue(true);
    
    component.createCustomerForm();
    component.customerForm.patchValue({
      customerName: 'New Customer',
      customerCode: 'NC001',
      email: 'new@test.com',
      phoneNumber: '1234567890',
      address: 'New Address'
    });
    
    component.addCustomer();
    
    expect(mockCustomerService.addCustomer).toHaveBeenCalled();
  });
});
