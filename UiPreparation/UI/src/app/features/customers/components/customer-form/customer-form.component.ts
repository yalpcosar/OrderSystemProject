import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../../core/models/customer.model';
import { CustomerService } from '../../../../core/components/admin/customer/services/Customer.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  customerId: number;
  customer: Customer;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAuthorization();
    this.createCustomerForm();
    this.checkEditMode();
  }

  checkAuthorization(): void {
    const hasAccess = this.authService.claimGuard('AddCustomerCommand') || 
                     this.authService.claimGuard('UpdateCustomerCommand');
    if (!hasAccess) {
      this.alertifyService.error('You do not have permission to access this page');
      this.router.navigate(['/customers']);
    }
  }

  createCustomerForm(): void {
    this.customerForm = this.formBuilder.group({
      customerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      customerCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      address: ['', [Validators.maxLength(200)]]
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.customerId = +id;
      this.loadCustomer();
    }
  }

  loadCustomer(): void {
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (data) => {
        this.customer = data;
        this.customerForm.patchValue({
          customerName: data.customerName,
          customerCode: data.customerCode,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address
        });
      },
      error: (error) => {
        this.alertifyService.error('Error loading customer: ' + error.message);
        this.router.navigate(['/customers']);
      }
    });
  }

  save(): void {
    if (this.customerForm.valid) {
      if (this.isEditMode) {
        this.updateCustomer();
      } else {
        this.addCustomer();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  addCustomer(): void {
    if (!this.authService.claimGuard('AddCustomerCommand')) {
      this.alertifyService.error('You do not have permission to add customers');
      return;
    }

    const customer: Customer = {
      id: 0,
      customerName: this.customerForm.value.customerName,
      customerCode: this.customerForm.value.customerCode,
      email: this.customerForm.value.email,
      phoneNumber: this.customerForm.value.phoneNumber,
      address: this.customerForm.value.address,
      createdUserId: 0,
      createdDate: new Date(),
      lastUpdatedUserId: 0,
      lastUpdatedDate: new Date(),
      status: true,
      isDeleted: false
    };

    this.customerService.addCustomer(customer).subscribe({
      next: (response) => {
        this.alertifyService.success('Customer added successfully');
        this.router.navigate(['/customers']);
      },
      error: (error) => {
        this.alertifyService.error('Error adding customer: ' + error.message);
      }
    });
  }

  updateCustomer(): void {
    if (!this.authService.claimGuard('UpdateCustomerCommand')) {
      this.alertifyService.error('You do not have permission to update customers');
      return;
    }

    const customer: Customer = {
      id: this.customerId,
      customerName: this.customerForm.value.customerName,
      customerCode: this.customerForm.value.customerCode,
      email: this.customerForm.value.email,
      phoneNumber: this.customerForm.value.phoneNumber,
      address: this.customerForm.value.address,
      createdUserId: this.customer.createdUserId,
      createdDate: this.customer.createdDate,
      lastUpdatedUserId: 0,
      lastUpdatedDate: new Date(),
      status: this.customer.status,
      isDeleted: this.customer.isDeleted
    };

    this.customerService.updateCustomer(customer).subscribe({
      next: (response) => {
        this.alertifyService.success('Customer updated successfully');
        this.router.navigate(['/customers']);
      },
      error: (error) => {
        this.alertifyService.error('Error updating customer: ' + error.message);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/customers']);
  }

  markFormGroupTouched(): void {
    Object.keys(this.customerForm.controls).forEach(key => {
      const control = this.customerForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.customerForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      return `${fieldName} must not exceed ${control.errors?.['maxlength'].requiredLength} characters`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('pattern')) {
      if (fieldName === 'phoneNumber') {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.customerForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getPageTitle(): string {
    return this.isEditMode ? 'Edit Customer' : 'Add Customer';
  }
}
