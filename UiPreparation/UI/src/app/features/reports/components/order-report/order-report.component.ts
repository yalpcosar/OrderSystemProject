import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderService } from '../../../../core/components/admin/order/services/Order.service';
import { OrderDto } from '../../../../core/components/admin/order/models/OrderDto';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';

export interface OrderReportData {
  orderId: number;
  orderDate: Date;
  customerName: string;
  productName: string;
  productCode: string;
  color: string;
  size: string;
  quantity: number;
  status: string;
  price: number;
  totalPrice: number;
}

export interface ReportSummary {
  totalOrders: number;
  totalQuantity: number;
  totalRevenue: number;
}

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss']
})
export class OrderReportComponent implements OnInit {
  displayedColumns: string[] = [
    'orderId',
    'orderDate',
    'customerName',
    'productName',
    'productCode',
    'color',
    'size',
    'quantity',
    'status',
    'price',
    'totalPrice'
  ];
  
  dataSource: MatTableDataSource<OrderReportData>;
  isLoading = false;
  filterForm: FormGroup;
  summary: ReportSummary = {
    totalOrders: 0,
    totalQuantity: 0,
    totalRevenue: 0
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderService: OrderService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<OrderReportData>([]);
    this.filterForm = this.createFilterForm();
  }

  ngOnInit(): void {
    this.checkAuthorization();
    this.loadOrderReport();
  }

  createFilterForm(): FormGroup {
    return this.fb.group({
      startDate: [''],
      endDate: [''],
      searchTerm: [''],
      status: ['']
    });
  }

  checkAuthorization(): void {
    const hasAccess = this.authService.claimGuard('CustomerRepresentative') || 
                     this.authService.claimGuard('Admin') ||
                     this.authService.claimGuard('Manager');
    if (!hasAccess) {
      this.alertifyService.error('You do not have permission to access this page');
      // Redirect to dashboard or appropriate page
    }
  }

  loadOrderReport(): void {
    this.isLoading = true;
    const formValue = this.filterForm.value;
    
    this.orderService.getOrderReport(
      formValue.startDate ? formValue.startDate.toISOString().split('T')[0] : undefined,
      formValue.endDate ? formValue.endDate.toISOString().split('T')[0] : undefined
    ).subscribe({
      next: (response) => {
        // Assuming the API returns data in the expected format
        const reportData = this.transformOrderData(response.data || response);
        this.dataSource.data = reportData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.calculateSummary(reportData);
        this.isLoading = false;
      },
      error: (error) => {
        this.alertifyService.error('Failed to load order report');
        console.error('Error loading order report:', error);
        this.isLoading = false;
      }
    });
  }

  transformOrderData(orders: any[]): OrderReportData[] {
    return orders.map(order => ({
      orderId: order.orderId,
      orderDate: new Date(order.orderDate),
      customerName: order.customerName,
      productName: order.productName,
      productCode: order.productCode,
      color: order.color || 'N/A',
      size: order.size || 'N/A',
      quantity: order.quantity,
      status: order.status,
      price: order.price,
      totalPrice: order.totalPrice
    }));
  }

  calculateSummary(data: OrderReportData[]): void {
    this.summary = {
      totalOrders: data.length,
      totalQuantity: data.reduce((sum, order) => sum + order.quantity, 0),
      totalRevenue: data.reduce((sum, order) => sum + order.totalPrice, 0)
    };
  }

  applyFilters(): void {
    this.loadOrderReport();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.loadOrderReport();
  }

  applySearchFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToExcel(): void {
    // Implementation for Excel export
    this.alertifyService.success('Export functionality will be implemented');
  }

  exportToPDF(): void {
    // Implementation for PDF export
    this.alertifyService.success('Export functionality will be implemented');
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
}
