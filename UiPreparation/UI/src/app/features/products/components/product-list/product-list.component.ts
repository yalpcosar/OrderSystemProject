import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Product } from '../../../../core/components/admin/product/models/Product';
import { ProductService } from '../../../../core/components/admin/product/services/Product.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = [
    'name', 
    'colorName', 
    'size', 
    'quantity', 
    'isAvailableForSale', 
    'status', 
    'actions'
  ];
  dataSource: MatTableDataSource<Product>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productService: ProductService,
    private router: Router,
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.checkAuthorization();
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  checkAuthorization(): void {
    const hasAccess = this.authService.claimGuard('GetProductQuery') || 
                     this.authService.claimGuard('GetProductListQuery');
    if (!hasAccess) {
      this.alertifyService.error('You do not have permission to access this page');
      this.router.navigate(['/dashboard']);
    }
  }

  loadProducts(): void {
    this.productService.getProductsWithStock().subscribe({
      next: (products) => {
        this.dataSource.data = products;
      },
      error: (error) => {
        this.alertifyService.error('Failed to load products');
        console.error('Error loading products:', error);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addProduct(): void {
    if (this.authService.claimGuard('AddProductCommand')) {
      this.router.navigate(['/products/add']);
    } else {
      this.alertifyService.error('You do not have permission to add products');
    }
  }

  editProduct(product: Product): void {
    if (this.authService.claimGuard('UpdateProductCommand')) {
      this.router.navigate(['/products/edit', product.productId]);
    } else {
      this.alertifyService.error('You do not have permission to edit products');
    }
  }

  deleteProduct(product: Product): void {
    if (this.authService.claimGuard('DeleteProductCommand')) {
      this.productService.deleteProduct(product.productId).subscribe({
        next: () => {
          this.alertifyService.success('Product deleted successfully');
          this.loadProducts();
        },
        error: (error) => {
          this.alertifyService.error('Failed to delete product');
          console.error('Error deleting product:', error);
        }
      });
    } else {
      this.alertifyService.error('You do not have permission to delete products');
    }
  }

  getSizeDisplayName(size: number): string {
    const sizeMap = {
      1: 'S',
      2: 'M', 
      3: 'L',
      4: 'XL'
    };
    return sizeMap[size] || 'Unknown';
  }

  getStockStatusClass(quantity: number, isAvailable: boolean): string {
    if (!isAvailable) return 'unavailable';
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 10) return 'low-stock';
    return 'in-stock';
  }

  getStockStatusText(quantity: number, isAvailable: boolean): string {
    if (!isAvailable) return 'Unavailable';
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 10) return 'Low Stock';
    return 'In Stock';
  }
}
