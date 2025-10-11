import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ColorDialogComponent } from './color-dialog.component';
import { PColorService } from '../../../../core/components/admin/pcolor/services/PColor.service';
import { AlertifyService } from '../../../../core/services/alertify.service';

describe('ColorDialogComponent', () => {
  let component: ColorDialogComponent;
  let fixture: ComponentFixture<ColorDialogComponent>;
  let mockColorService: jasmine.SpyObj<PColorService>;
  let mockAlertifyService: jasmine.SpyObj<AlertifyService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ColorDialogComponent>>;

  beforeEach(async () => {
    const colorServiceSpy = jasmine.createSpyObj('PColorService', ['getColorList', 'addColor', 'updateColor', 'deleteColor']);
    const alertifyServiceSpy = jasmine.createSpyObj('AlertifyService', ['error', 'success']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ColorDialogComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        TranslateModule.forRoot(),
        SweetAlert2Module.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        { provide: PColorService, useValue: colorServiceSpy },
        { provide: AlertifyService, useValue: alertifyServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorDialogComponent);
    component = fixture.componentInstance;
    mockColorService = TestBed.inject(PColorService) as jasmine.SpyObj<PColorService>;
    mockAlertifyService = TestBed.inject(AlertifyService) as jasmine.SpyObj<AlertifyService>;
    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ColorDialogComponent>>;

    // Setup default mock returns
    mockColorService.getColorList.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with validators', () => {
    component.ngOnInit();
    expect(component.colorForm.get('name')?.hasError('required')).toBeTruthy();
    expect(component.colorForm.get('hexCode')?.hasError('required')).toBeTruthy();
  });

  it('should load colors on init', () => {
    component.ngOnInit();
    expect(mockColorService.getColorList).toHaveBeenCalled();
    expect(component.colors).toEqual([]);
  });

  it('should create color when form is valid', () => {
    mockColorService.addColor.and.returnValue(of({}));
    
    component.colorForm.patchValue({
      name: 'Green',
      hexCode: '#00FF00'
    });
    
    component.onAddColor();
    
    expect(mockColorService.addColor).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Green',
      hexCode: '#00FF00'
    }));
    expect(mockAlertifyService.success).toHaveBeenCalledWith('Color created successfully');
    expect(component.colorForm.get('name')?.value).toBe('');
    expect(component.colorForm.get('hexCode')?.value).toBe('');
  });

  it('should update color when form is valid and in edit mode', () => {
    component.isEditMode = true;
    component.editingColorId = 1;
    mockColorService.updateColor.and.returnValue(of({}));
    
    component.colorForm.patchValue({
      name: 'Updated Red',
      hexCode: '#FF0000'
    });
    
    component.onUpdateColor();
    
    expect(mockColorService.updateColor).toHaveBeenCalledWith(jasmine.objectContaining({
      id: 1,
      name: 'Updated Red',
      hexCode: '#FF0000'
    }));
    expect(mockAlertifyService.success).toHaveBeenCalledWith('Color updated successfully');
  });

  it('should not submit when form is invalid', () => {
    spyOn(component, 'markFormGroupTouched');
    
    component.onAddColor();
    
    expect(component.markFormGroupTouched).toHaveBeenCalled();
    expect(mockColorService.addColor).not.toHaveBeenCalled();
  });

  it('should enter edit mode when editing color', () => {
    const color = { id: 1, name: 'Red', hexCode: '#FF0000', createdUserId: 0, createdDate: new Date(), lastUpdatedUserId: 0, lastUpdatedDate: new Date(), status: true, isDeleted: false };
    
    component.onEditColor(color);
    
    expect(component.isEditMode).toBeTruthy();
    expect(component.editingColorId).toBe(color.id);
    expect(component.colorForm.get('name')?.value).toBe(color.name);
    expect(component.colorForm.get('hexCode')?.value).toBe(color.hexCode);
  });

  it('should cancel edit mode', () => {
    component.isEditMode = true;
    component.editingColorId = 1;
    component.colorForm.patchValue({ name: 'Test', hexCode: '#000000' });
    
    component.cancelEdit();
    
    expect(component.isEditMode).toBeFalsy();
    expect(component.editingColorId).toBeNull();
    expect(component.colorForm.get('name')?.value).toBe('');
    expect(component.colorForm.get('hexCode')?.value).toBe('');
  });

  it('should delete color with confirmation', () => {
    const color = { id: 1, name: 'Red', hexCode: '#FF0000', createdUserId: 0, createdDate: new Date(), lastUpdatedUserId: 0, lastUpdatedDate: new Date(), status: true, isDeleted: false };
    mockColorService.deleteColor.and.returnValue(of({}));
    
    component.onDeleteColor(color);
    
    expect(mockColorService.deleteColor).toHaveBeenCalledWith(color.id);
    expect(mockAlertifyService.success).toHaveBeenCalledWith('Color deleted successfully');
  });

  it('should close dialog', () => {
    component.onClose();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should get correct error message for required field', () => {
    component.colorForm.get('name')?.markAsTouched();
    expect(component.getErrorMessage('name')).toBe('name is required');
  });

  it('should get correct error message for pattern', () => {
    component.colorForm.patchValue({ hexCode: 'invalid' });
    component.colorForm.get('hexCode')?.markAsTouched();
    expect(component.getErrorMessage('hexCode')).toBe('Please enter a valid hex color code (e.g., #FF0000)');
  });

  it('should return true for invalid field', () => {
    component.colorForm.get('name')?.markAsTouched();
    expect(component.isFieldInvalid('name')).toBeTruthy();
  });

  it('should return false for valid field', () => {
    component.colorForm.patchValue({ name: 'Valid Name' });
    component.colorForm.get('name')?.markAsTouched();
    expect(component.isFieldInvalid('name')).toBeFalsy();
  });

  it('should check if color is being edited', () => {
    component.isEditMode = true;
    component.editingColorId = 1;
    
    expect(component.isEditingColor(1)).toBeTruthy();
    expect(component.isEditingColor(2)).toBeFalsy();
  });
});
