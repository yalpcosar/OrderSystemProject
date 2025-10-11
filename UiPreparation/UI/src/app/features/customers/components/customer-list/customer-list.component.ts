import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Customer } from '../../../../core/models/customer.model';
import { CustomerService } from '../../../../core/components/admin/customer/services/Customer.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { AuthService } from '../../../../core/components/admin/login/services/auth.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Customer>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'id',
    'customerName',
    'customerCode',
    'email',
    'phoneNumber',
    'address',
    'status',
    'actions'
  ];

  customerList: Customer[] = [];

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAuthorization();
    this.getCustomerList();
  }

  ngAfterViewInit(): void {
    this.configDataTable();
  }

  checkAuthorization(): void {
    const hasAccess = this.authService.claimGuard('GetCustomersQuery') || 
                     this.authService.claimGuard('GetCustomerRepresentativesQuery');
    if (!hasAccess) {
      this.alertifyService.error('You do not have permission to access this page');
      this.router.navigate(['/dashboard']);
    }
  }

  getCustomerList(): void {
    this.customerService.getCustomerList().subscribe({
      next: (data: Customer[]) => {
        this.customerList = data;
        this.dataSource = new MatTableDataSource(data);
        this.configDataTable();
      },
      error: (error) => {
        this.alertifyService.error('Error loading customers: ' + error.message);
      }
    });
  }

  configDataTable(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addCustomer(): void {
    if (this.authService.claimGuard('AddCustomerCommand')) {
      this.router.navigate(['/customers/add']);
    } else {
      this.alertifyService.error('You do not have permission to add customers');
    }
  }

  editCustomer(id: number): void {
    if (this.authService.claimGuard('UpdateCustomerCommand')) {
      this.router.navigate(['/customers/edit', id]);
    } else {
      this.alertifyService.error('You do not have permission to edit customers');
    }
  }

  deleteCustomer(id: number): void {
    if (this.authService.claimGuard('DeleteCustomerCommand')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: (response) => {
          this.alertifyService.success('Customer deleted successfully');
          this.getCustomerList(); // Refresh the list
        },
        error: (error) => {
          this.alertifyService.error('Error deleting customer: ' + error.message);
        }
      });
    } else {
      this.alertifyService.error('You do not have permission to delete customers');
    }
  }

  getStatusText(status: boolean): string {
    return status ? 'Active' : 'Inactive';
  }

  getStatusClass(status: boolean): string {
    return status ? 'status-active' : 'status-inactive';
  }

  canAdd(): boolean {
    return this.authService.claimGuard('AddCustomerCommand');
  }

  canEdit(): boolean {
    return this.authService.claimGuard('UpdateCustomerCommand');
  }

  canDelete(): boolean {
    return this.authService.claimGuard('DeleteCustomerCommand');
  }
}
