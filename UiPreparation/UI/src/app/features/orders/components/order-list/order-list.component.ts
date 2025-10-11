import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { OrderService } from '../../../../core/components/admin/order/services/Order.service';
import { OrderDto } from '../../../../core/components/admin/order/models/OrderDto';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  displayedColumns: string[] = [
    'orderId',
    'orderDate',
    'customerName',
    'productName',
    'productCode',
    'quantity',
    'price',
    'totalPrice',
    'status',
    'actions'
  ];
  dataSource: MatTableDataSource<OrderDto>;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) {
    this.dataSource = new MatTableDataSource<OrderDto>([]);
  }

  ngOnInit(): void {
    this.checkAuthorization();
    this.loadOrders();
  }

  checkAuthorization(): void {
    const hasAccess = this.authService.claimGuard('CustomerRepresentative');
    if (!hasAccess) {
      this.alertifyService.error('You do not have permission to access this page');
      this.router.navigate(['/dashboard']);
    }
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getOrderList().subscribe({
      next: (orders) => {
        this.dataSource.data = orders;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        this.alertifyService.error('Failed to load orders');
        console.error('Error loading orders:', error);
        this.isLoading = false;
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

  onAddOrder(): void {
    this.router.navigate(['/orders/add']);
  }

  onEditOrder(order: OrderDto): void {
    this.router.navigate(['/orders/edit', order.orderId]);
  }

  onDeleteOrder(order: OrderDto): void {
    this.alertifyService.confirm(
      'Delete Order',
      `Are you sure you want to delete order ${order.orderId}?`,
      () => {
        this.orderService.deleteOrder(order.orderId).subscribe({
          next: () => {
            this.alertifyService.success('Order deleted successfully');
            this.loadOrders();
          },
          error: (error) => {
            this.alertifyService.error('Failed to delete order');
            console.error('Error deleting order:', error);
          }
        });
      }
    );
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }
}
