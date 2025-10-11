import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { WarehouseService } from '../../../../core/components/admin/warehouse/services/Warehouse.service';
import { WarehouseItem, WarehouseReport } from '../../../../core/models/warehouse.model';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';

@Component({
  selector: 'app-warehouse-report',
  templateUrl: './warehouse-report.component.html',
  styleUrls: ['./warehouse-report.component.scss']
})
export class WarehouseReportComponent implements OnInit {
  displayedColumns: string[] = [
    'productName',
    'colorName',
    'size',
    'quantity',
    'availabilityStatus',
    'stockLevel'
  ];
  dataSource: MatTableDataSource<WarehouseItem>;
  isLoading = false;
  warehouseReport: WarehouseReport | null = null;
  availabilityFilter: string = 'all';
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private warehouseService: WarehouseService,
    private router: Router,
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) {
    this.dataSource = new MatTableDataSource<WarehouseItem>([]);
  }

  ngOnInit(): void {
    this.checkAuthorization();
    this.loadWarehouseReport();
  }

  checkAuthorization(): void {
    const hasAccess = this.authService.loggedIn();
    if (!hasAccess) {
      this.alertifyService.error('You must be logged in to access this page');
      this.router.navigate(['/login']);
    }
  }

  loadWarehouseReport(): void {
    this.isLoading = true;
    this.warehouseService.getWarehouseReport().subscribe({
      next: (report) => {
        this.warehouseReport = report;
        this.dataSource.data = report.items || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        this.alertifyService.error('Failed to load warehouse report');
        console.error('Error loading warehouse report:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    let filteredData = this.warehouseReport?.items || [];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(item =>
        item.productName.toLowerCase().includes(searchLower) ||
        item.colorName.toLowerCase().includes(searchLower)
      );
    }

    // Apply availability filter
    if (this.availabilityFilter !== 'all') {
      filteredData = filteredData.filter(item => {
        switch (this.availabilityFilter) {
          case 'available':
            return item.isAvailableForSale && item.quantity > 0;
          case 'unavailable':
            return !item.isAvailableForSale;
          case 'outOfStock':
            return item.quantity === 0;
          case 'lowStock':
            return item.quantity > 0 && item.quantity <= 10;
          default:
            return true;
        }
      });
    }

    this.dataSource.data = filteredData;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  onAvailabilityFilterChange(): void {
    this.applyFilter();
  }

  getStockLevelClass(quantity: number): string {
    if (quantity === 0) {
      return 'stock-out';
    } else if (quantity <= 10) {
      return 'stock-low';
    } else if (quantity <= 50) {
      return 'stock-medium';
    } else {
      return 'stock-high';
    }
  }

  getStockLevelText(quantity: number): string {
    if (quantity === 0) {
      return 'Out of Stock';
    } else if (quantity <= 10) {
      return 'Low Stock';
    } else if (quantity <= 50) {
      return 'Medium Stock';
    } else {
      return 'High Stock';
    }
  }

  getAvailabilityStatus(item: WarehouseItem): string {
    if (!item.isAvailableForSale) {
      return 'Unavailable';
    } else if (item.quantity === 0) {
      return 'Out of Stock';
    } else {
      return 'Available';
    }
  }

  getAvailabilityClass(item: WarehouseItem): string {
    if (!item.isAvailableForSale) {
      return 'status-unavailable';
    } else if (item.quantity === 0) {
      return 'status-out-of-stock';
    } else {
      return 'status-available';
    }
  }

  exportToCSV(): void {
    if (!this.dataSource.data.length) {
      this.alertifyService.warning('No data to export');
      return;
    }

    const headers = ['Product Name', 'Color', 'Size', 'Quantity', 'Availability Status'];
    const csvContent = [
      headers.join(','),
      ...this.dataSource.data.map(item => [
        `"${item.productName}"`,
        `"${item.colorName}"`,
        `"${this.getSizeLabel(item.size)}"`,
        item.quantity,
        `"${this.getAvailabilityStatus(item)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `warehouse-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    this.alertifyService.success('Warehouse report exported successfully');
  }

  private getSizeLabel(size: any): string {
    // This will be handled by the SizeLabelPipe in the template
    return size?.toString() || '';
  }

  getColorHex(colorName: string): string {
    // Simple color mapping - you can extend this based on your color system
    const colorMap: { [key: string]: string } = {
      'red': '#f44336',
      'blue': '#2196f3',
      'green': '#4caf50',
      'yellow': '#ffeb3b',
      'purple': '#9c27b0',
      'orange': '#ff9800',
      'pink': '#e91e63',
      'black': '#424242',
      'white': '#f5f5f5',
      'brown': '#795548',
      'gray': '#9e9e9e',
      'cyan': '#00bcd4',
      'lime': '#cddc39',
      'indigo': '#3f51b5',
      'teal': '#009688'
    };
    return colorMap[colorName.toLowerCase()] || '#9e9e9e';
  }

  getAvailabilityIcon(item: WarehouseItem): string {
    if (!item.isAvailableForSale) {
      return 'block';
    } else if (item.quantity === 0) {
      return 'warning';
    } else {
      return 'check_circle';
    }
  }

  getStockLevelIcon(quantity: number): string {
    if (quantity === 0) {
      return 'error';
    } else if (quantity <= 10) {
      return 'warning';
    } else if (quantity <= 50) {
      return 'info';
    } else {
      return 'check_circle';
    }
  }

  refreshReport(): void {
    this.loadWarehouseReport();
  }
}
