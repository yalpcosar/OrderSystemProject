import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { CustomerListComponent } from './customer-list.component';
import { CustomerService } from '../../../../core/components/admin/customer/services/Customer.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;
  let mockCustomerService: jasmine.SpyObj<CustomerService>;
  let mockAlertifyService: jasmine.SpyObj<AlertifyService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getCustomerList', 'deleteCustomer']);
    const alertifyServiceSpy = jasmine.createSpyObj('AlertifyService', ['success', 'error']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['claimGuard']);

    await TestBed.configureTestingModule({
      declarations: [CustomerListComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        SweetAlert2Module.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        { provide: CustomerService, useValue: customerServiceSpy },
        { provide: AlertifyService, useValue: alertifyServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    mockCustomerService = TestBed.inject(CustomerService) as jasmine.SpyObj<CustomerService>;
    mockAlertifyService = TestBed.inject(AlertifyService) as jasmine.SpyObj<AlertifyService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Setup default mock behavior
    mockAuthService.claimGuard.and.returnValue(true);
    mockCustomerService.getCustomerList.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load customer list on init', () => {
    const mockCustomers = [
      { id: 1, customerName: 'Test Customer', customerCode: 'TC001', email: 'test@test.com', phoneNumber: '1234567890', address: 'Test Address', status: true, isDeleted: false, createdUserId: 1, createdDate: new Date(), lastUpdatedUserId: 1, lastUpdatedDate: new Date() }
    ];
    mockCustomerService.getCustomerList.and.returnValue(of(mockCustomers));

    component.ngOnInit();

    expect(mockCustomerService.getCustomerList).toHaveBeenCalled();
    expect(component.customerList).toEqual(mockCustomers);
  });

  it('should check authorization on init', () => {
    component.ngOnInit();
    expect(mockAuthService.claimGuard).toHaveBeenCalledWith('GetCustomersQuery');
  });

  it('should navigate to add customer when canAdd returns true', () => {
    spyOn(component['router'], 'navigate');
    mockAuthService.claimGuard.and.returnValue(true);

    component.addCustomer();

    expect(component['router'].navigate).toHaveBeenCalledWith(['/customers/add']);
  });

  it('should show error when cannot add customer', () => {
    mockAuthService.claimGuard.and.returnValue(false);

    component.addCustomer();

    expect(mockAlertifyService.error).toHaveBeenCalledWith('You do not have permission to add customers');
  });
});
