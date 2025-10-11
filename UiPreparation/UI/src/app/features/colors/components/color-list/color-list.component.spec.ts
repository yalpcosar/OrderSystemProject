import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { of } from 'rxjs';

import { ColorListComponent } from './color-list.component';
import { PColorService } from '../../../../core/components/admin/pcolor/services/PColor.service';
import { AlertifyService } from '../../../../core/services/alertify.service';
import { SharedModule } from '../../../../core/shared/shared.module';

describe('ColorListComponent', () => {
  let component: ColorListComponent;
  let fixture: ComponentFixture<ColorListComponent>;
  let mockColorService: jasmine.SpyObj<PColorService>;
  let mockAlertifyService: jasmine.SpyObj<AlertifyService>;

  beforeEach(async () => {
    const colorServiceSpy = jasmine.createSpyObj('PColorService', ['getColorList', 'deleteColor']);
    const alertifyServiceSpy = jasmine.createSpyObj('AlertifyService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [ColorListComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatTooltipModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        SweetAlert2Module.forRoot(),
        SharedModule
      ],
      providers: [
        { provide: PColorService, useValue: colorServiceSpy },
        { provide: AlertifyService, useValue: alertifyServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorListComponent);
    component = fixture.componentInstance;
    mockColorService = TestBed.inject(PColorService) as jasmine.SpyObj<PColorService>;
    mockAlertifyService = TestBed.inject(AlertifyService) as jasmine.SpyObj<AlertifyService>;
  });

  beforeEach(() => {
    const mockColors = [
      { id: 1, name: 'Red', code: '#FF0000' },
      { id: 2, name: 'Blue', code: '#0000FF' }
    ];
    mockColorService.getColorList.and.returnValue(of(mockColors));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load colors on init', () => {
    component.ngOnInit();
    expect(mockColorService.getColorList).toHaveBeenCalled();
  });

  it('should apply filter correctly', () => {
    const mockEvent = { target: { value: 'red' } } as any;
    component.dataSource = new MatTableDataSource([
      { id: 1, name: 'Red', code: '#FF0000' },
      { id: 2, name: 'Blue', code: '#0000FF' }
    ]);
    
    component.applyFilter(mockEvent);
    expect(component.dataSource.filter).toBe('red');
  });

  it('should get status text correctly', () => {
    expect(component.getStatusText(true)).toBe('Active');
    expect(component.getStatusText(false)).toBe('Inactive');
  });

  it('should get status class correctly', () => {
    expect(component.getStatusClass(true)).toBe('status-active');
    expect(component.getStatusClass(false)).toBe('status-inactive');
  });
});
