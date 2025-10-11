import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Order } from '../../../../core/components/admin/order/models/Order';
import { OrderDto } from '../../../../core/components/admin/order/models/OrderDto';
import { Customer } from '../../../../core/models/customer.model';
import { Product } from '../../../../core/components/admin/product/models/Product';
import { OrderService } from '../../../../core/components/admin/order/services/Order.service';
import { CustomerService } from '../../../../core/components/admin/customer/services/Customer.service';
import { ProductService } from '../../../../core/components/admin/product/services/Product.service';
import { WarehouseService } from '../../../../core/components/admin/warehouse/services/Warehouse.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';

interface StockAvailability {
  isAvailable: boolean;
  availableQuantity: number;
  message: string;
}

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  isEditMode = false;
  orderId: number;
  order: Order;
  customers: Customer[] = [];
  products: Product[] = [];
  isLoading = false;
  isCheckingStock = false;
  
  // Stock validation properties
  stockAvailability: StockAvailability = {
    isAvailable: false,
    availableQuantity: 0,
    message: ''
  };
  
  private productChangeSubject = new Subject<number>();
  private quantityChangeSubject = new Subject<number>();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkAuthorization();
    this.createOrderForm();
    this.loadCustomers();
    this.loadProducts();
    this.setupStockValidation();
    this.checkEditMode();
  }

  checkAuthorization(): void {
    const hasAccess = this.authService.claimGuard('CustomerRepresentative');
    if (!hasAccess) {
      this.alertifyService.error('You do not have permission to access this page');
      this.router.navigate(['/orders']);
    }
  }

  createOrderForm(): void {
    this.orderForm = this.formBuilder.group({
      customerId: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });

    // Listen to form changes for stock validation
    this.orderForm.get('productId')?.valueChanges.subscribe(productId => {
      if (productId) {
        this.productChangeSubject.next(productId);
        this.resetStockValidation();
      }
    });

    this.orderForm.get('quantity')?.valueChanges.subscribe(quantity => {
      if (quantity && quantity > 0) {
        this.quantityChangeSubject.next(quantity);
      }
    });
  }

  setupStockValidation(): void {
    // Debounce product changes to avoid excessive API calls
    this.productChangeSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(productId => {
        const quantity = this.orderForm.get('quantity')?.value;
        if (quantity && quantity > 0) {
          return this.checkStockAvailability(productId, quantity);
        }
        return [];
      })
    ).subscribe();

    // Debounce quantity changes
    this.quantityChangeSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(quantity => {
        const productId = this.orderForm.get('productId')?.value;
        if (productId && quantity > 0) {
          return this.checkStockAvailability(productId, quantity);
        }
        return [];
      })
    ).subscribe();
  }

  checkStockAvailability(productId: number, quantity: number): any {
    this.isCheckingStock = true;
    return this.warehouseService.checkAvailability(productId, quantity).subscribe({
      next: (response) => {
        this.stockAvailability = {
          isAvailable: response.isAvailable || false,
          availableQuantity: response.availableQuantity || 0,
          message: response.message || ''
        };
        this.isCheckingStock = false;
      },
      error: (error) => {
        console.error('Error checking stock availability:', error);
        this.stockAvailability = {
          isAvailable: false,
          availableQuantity: 0,
          message: 'Unable to check stock availability'
        };
        this.isCheckingStock = false;
      }
    });
  }

  resetStockValidation(): void {
    this.stockAvailability = {
      isAvailable: false,
      availableQuantity: 0,
      message: ''
    };
  }

  loadCustomers(): void {
    this.customerService.getCustomerList().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        this.alertifyService.error('Failed to load customers');
        console.error('Error loading customers:', error);
      }
    });
  }

  loadProducts(): void {
    this.productService.getProductsWithStock().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        this.alertifyService.error('Failed to load products');
        console.error('Error loading products:', error);
      }
    });
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.orderId = +params['id'];
        this.loadOrder();
      }
    });
  }

  loadOrder(): void {
    this.isLoading = true;
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.orderForm.patchValue({
          customerId: order.customerId,
          productId: order.productId,
          quantity: order.quantity
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.alertifyService.error('Failed to load order');
        console.error('Error loading order:', error);
        this.isLoading = false;
        this.router.navigate(['/orders']);
      }
    });
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      // Check stock availability before submission
      if (!this.stockAvailability.isAvailable) {
        this.showStockError();
        return;
      }

      this.isLoading = true;
      const formData = this.orderForm.value;
      
      if (this.isEditMode) {
        this.updateOrder(formData);
      } else {
        this.createOrder(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createOrder(formData: any): void {
    const orderData: Order = {
      orderId: 0,
      customerId: formData.customerId,
      productId: formData.productId,
      productCode: '',
      quantity: formData.quantity,
      price: 0,
      status: 1,
      orderDate: new Date(),
      deliveryDate: new Date()
    };

    this.orderService.addOrder(orderData).subscribe({
      next: (response) => {
        this.alertifyService.success('Order created successfully');
        this.router.navigate(['/orders']);
        this.isLoading = false;
      },
      error: (error) => {
        this.alertifyService.error('Failed to create order');
        console.error('Error creating order:', error);
        this.isLoading = false;
      }
    });
  }

  updateOrder(formData: any): void {
    const orderData: Order = {
      orderId: this.orderId,
      customerId: formData.customerId,
      productId: formData.productId,
      productCode: '',
      quantity: formData.quantity,
      price: 0,
      status: 1,
      orderDate: new Date(),
      deliveryDate: new Date()
    };

    this.orderService.updateOrder(orderData).subscribe({
      next: (response) => {
        this.alertifyService.success('Order updated successfully');
        this.router.navigate(['/orders']);
        this.isLoading = false;
      },
      error: (error) => {
        this.alertifyService.error('Failed to update order');
        console.error('Error updating order:', error);
        this.isLoading = false;
      }
    });
  }

  showStockError(): void {
    this.snackBar.open(
      'Cannot create order: Insufficient stock available',
      'Close',
      {
        duration: 5000,
        panelClass: ['error-snackbar']
      }
    );
  }

  markFormGroupTouched(): void {
    Object.keys(this.orderForm.controls).forEach(key => {
      const control = this.orderForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/orders']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.orderForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required`;
    }
    if (control?.hasError('min')) {
      return `${controlName} must be at least ${control.errors?.['min'].min}`;
    }
    return '';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.orderForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isSubmitDisabled(): boolean {
    return !this.orderForm.valid || !this.stockAvailability.isAvailable || this.isLoading;
  }

  getStockStatusClass(): string {
    if (this.isCheckingStock) {
      return 'stock-checking';
    }
    return this.stockAvailability.isAvailable ? 'stock-available' : 'stock-unavailable';
  }

  getStockStatusIcon(): string {
    if (this.isCheckingStock) {
      return 'hourglass_empty';
    }
    return this.stockAvailability.isAvailable ? 'check_circle' : 'error';
  }
}
