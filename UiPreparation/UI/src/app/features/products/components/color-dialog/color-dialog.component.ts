import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Color } from '../../../../core/models/color.model';
import { PColorService } from '../../../../core/components/admin/pcolor/services/PColor.service';
import { AlertifyService } from '../../../../core/services/alertify.service';

@Component({
  selector: 'app-color-dialog',
  templateUrl: './color-dialog.component.html',
  styleUrls: ['./color-dialog.component.scss']
})
export class ColorDialogComponent implements OnInit {
  colors: Color[] = [];
  colorForm: FormGroup;
  isEditMode = false;
  editingColorId: number | null = null;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<ColorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private colorService: PColorService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.createColorForm();
    this.loadColors();
  }

  createColorForm(): void {
    this.colorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      hexCode: ['', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]]
    });
  }

  loadColors(): void {
    this.isLoading = true;
    this.colorService.getColorList().subscribe({
      next: (colors) => {
        this.colors = colors;
        this.isLoading = false;
      },
      error: (error) => {
        this.alertifyService.error('Failed to load colors');
        console.error('Error loading colors:', error);
        this.isLoading = false;
      }
    });
  }

  onAddColor(): void {
    if (this.colorForm.valid) {
      this.isLoading = true;
      const formData = this.colorForm.value;
      
      const colorData: Color = {
        id: 0,
        name: formData.name,
        hexCode: formData.hexCode,
        createdUserId: 0,
        createdDate: new Date(),
        lastUpdatedUserId: 0,
        lastUpdatedDate: new Date(),
        status: true,
        isDeleted: false
      };

      this.colorService.addColor(colorData).subscribe({
        next: (response) => {
          this.alertifyService.success('Color created successfully');
          this.colorForm.reset();
          this.loadColors();
          this.isLoading = false;
        },
        error: (error) => {
          this.alertifyService.error('Failed to create color');
          console.error('Error creating color:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onEditColor(color: Color): void {
    this.isEditMode = true;
    this.editingColorId = color.id;
    this.colorForm.patchValue({
      name: color.name,
      hexCode: color.hexCode
    });
  }

  onUpdateColor(): void {
    if (this.colorForm.valid && this.editingColorId) {
      this.isLoading = true;
      const formData = this.colorForm.value;
      
      const colorData: Color = {
        id: this.editingColorId,
        name: formData.name,
        hexCode: formData.hexCode,
        createdUserId: 0,
        createdDate: new Date(),
        lastUpdatedUserId: 0,
        lastUpdatedDate: new Date(),
        status: true,
        isDeleted: false
      };

      this.colorService.updateColor(colorData).subscribe({
        next: (response) => {
          this.alertifyService.success('Color updated successfully');
          this.cancelEdit();
          this.loadColors();
          this.isLoading = false;
        },
        error: (error) => {
          this.alertifyService.error('Failed to update color');
          console.error('Error updating color:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onDeleteColor(color: Color): void {
    this.isLoading = true;
    this.colorService.deleteColor(color.id).subscribe({
      next: () => {
        this.alertifyService.success('Color deleted successfully');
        this.loadColors();
        this.isLoading = false;
      },
      error: (error) => {
        this.alertifyService.error('Failed to delete color');
        console.error('Error deleting color:', error);
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editingColorId = null;
    this.colorForm.reset();
  }

  onClose(): void {
    this.dialogRef.close(true);
  }

  markFormGroupTouched(): void {
    Object.keys(this.colorForm.controls).forEach(key => {
      const control = this.colorForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.colorForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${controlName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      return `${controlName} must not exceed ${control.errors?.['maxlength'].requiredLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid hex color code (e.g., #FF0000)';
    }
    return '';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.colorForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isEditingColor(colorId: number): boolean {
    return this.isEditMode && this.editingColorId === colorId;
  }
}
