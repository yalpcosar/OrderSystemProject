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
import { PColor } from '../../../../core/components/admin/pcolor/models/PColor';
import { PColorService } from '../../../../core/components/admin/pcolor/services/PColor.service';
import { AlertifyService } from '../../../../core/services/alertify.service';

@Component({
  selector: 'app-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss']
})
export class ColorListComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<PColor>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'id',
    'name',
    'code',
    'actions'
  ];

  colorList: PColor[] = [];

  constructor(
    private colorService: PColorService,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.getColorList();
  }

  ngAfterViewInit(): void {
    this.configDataTable();
  }

  getColorList(): void {
    this.colorService.getColorList().subscribe({
      next: (data) => {
        this.colorList = data;
        this.dataSource = new MatTableDataSource(data);
        this.configDataTable();
      },
      error: (error) => {
        this.alertifyService.error('Error loading colors: ' + error.message);
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

  addColor(): void {
    this.router.navigate(['/colors/add']);
  }

  editColor(id: number): void {
    this.router.navigate(['/colors/edit', id]);
  }

  deleteColor(id: number): void {
    this.colorService.deleteColor(id).subscribe({
      next: (response) => {
        this.alertifyService.success('Color deleted successfully');
        this.getColorList(); // Refresh the list
      },
      error: (error) => {
        this.alertifyService.error('Error deleting color: ' + error.message);
      }
    });
  }

  getStatusText(status: boolean): string {
    return status ? 'Active' : 'Inactive';
  }

  getStatusClass(status: boolean): string {
    return status ? 'status-active' : 'status-inactive';
  }
}
