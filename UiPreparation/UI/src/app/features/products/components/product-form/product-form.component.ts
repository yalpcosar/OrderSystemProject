import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Product as ProductModel } from '../../../../core/models/product.model';
import { Product } from '../../../../core/components/admin/product/models/Product';
import { Color } from '../../../../core/models/color.model';
import { ProductService } from '../../../../core/components/admin/product/services/Product.service';
import { PColorService } from '../../../../core/components/admin/pcolor/services/PColor.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';
import { ColorDialogComponent } from '../color-dialog/color-dialog.component';

import { SizeEnum } from '../../../../core/enums/size.enum';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number;
  product: Product;
  colors: Color[] = [];
  sizeOptions = [
    { value: SizeEnum.S, label: 'S' },
    { value: SizeEnum.M, label: 'M' },
    { value: SizeEnum.L, label: 'L' },
    { value: SizeEnum.XL, label: 'XL' }
  ];
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private colorService: PColorService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkAuthorization();
    this.createProductForm();
    this.loadColors();
    this.checkEditMode();
  }

  checkAuthorization(): void {
    const hasAccess = this.authService.claimGuard('AddProductCommand') || 
                     this.authService.claimGuard('UpdateProductCommand');
    if (!hasAccess) {
      this.alertifyService.error('You do not have permission to access this page');
      this.router.navigate(['/products']);
    }
  }

  createProductForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      colorId: ['', [Validators.required]],
      size: ['', [Validators.required]]
    });
  }

  loadColors(): void {
    this.colorService.getColorList().subscribe({
      next: (colors) => {
        this.colors = colors;
      },
      error: (error) => {
        this.alertifyService.error('Failed to load colors');
        console.error('Error loading colors:', error);
      }
    });
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct();
      }
    });
  }

  loadProduct(): void {
    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.productForm.patchValue({
          name: product.productName,
          colorId: product.pColorId,
          size: SizeEnum.M // Default size since service model doesn't have size
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.alertifyService.error('Failed to load product');
        console.error('Error loading product:', error);
        this.isLoading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      const formData = this.productForm.value;
      
      if (this.isEditMode) {
        this.updateProduct(formData);
      } else {
        this.createProduct(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createProduct(formData: any): void {
    const productData: Product = {
      productId: 0,
      productCode: '',
      productName: formData.name,
      price: 0,
      stock: 0,
      pColorId: formData.colorId,
      pColorName: ''
    };

    this.productService.addProduct(productData).subscribe({
      next: (response) => {
        this.alertifyService.success('Product created successfully');
        this.router.navigate(['/products']);
        this.isLoading = false;
      },
      error: (error) => {
        this.alertifyService.error('Failed to create product');
        console.error('Error creating product:', error);
        this.isLoading = false;
      }
    });
  }

  updateProduct(formData: any): void {
    const productData: Product = {
      productId: this.productId,
      productCode: '',
      productName: formData.name,
      price: 0,
      stock: 0,
      pColorId: formData.colorId,
      pColorName: ''
    };

    this.productService.updateProduct(productData).subscribe({
      next: (response) => {
        this.alertifyService.success('Product updated successfully');
        this.router.navigate(['/products']);
        this.isLoading = false;
      },
      error: (error) => {
        this.alertifyService.error('Failed to update product');
        console.error('Error updating product:', error);
        this.isLoading = false;
      }
    });
  }

  openColorDialog(): void {
    const dialogRef = this.dialog.open(ColorDialogComponent, {
      width: '600px',
      maxHeight: '80vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reload colors after dialog closes
        this.loadColors();
      }
    });
  }

  markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${controlName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      return `${controlName} must not exceed ${control.errors?.['maxlength'].requiredLength} characters`;
    }
    return '';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
