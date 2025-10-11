import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Color } from '../../../../core/models/color.model';
import { PColorService } from '../../../../core/components/admin/pcolor/services/PColor.service';
import { AlertifyService } from '../../../../core/services/alertify.service';

@Component({
  selector: 'app-color-form',
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss']
})
export class ColorFormComponent implements OnInit {
  colorForm: FormGroup;
  isEditMode = false;
  colorId: number;
  color: Color;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private colorService: PColorService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.createColorForm();
    this.checkEditMode();
  }

  createColorForm(): void {
    this.colorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      hexCode: ['', [Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]]
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.colorId = +id;
      this.loadColor();
    }
  }

  loadColor(): void {
    this.colorService.getColorById(this.colorId).subscribe({
      next: (data) => {
        this.color = data;
        this.colorForm.patchValue({
          name: data.name,
          hexCode: data.hexCode
        });
      },
      error: (error) => {
        this.alertifyService.error('Error loading color: ' + error.message);
        this.router.navigate(['/colors']);
      }
    });
  }

  save(): void {
    if (this.colorForm.valid) {
      if (this.isEditMode) {
        this.updateColor();
      } else {
        this.addColor();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  addColor(): void {
    const color: Color = {
      id: 0,
      name: this.colorForm.value.name,
      hexCode: this.colorForm.value.hexCode,
      createdUserId: 0,
      createdDate: new Date(),
      lastUpdatedUserId: 0,
      lastUpdatedDate: new Date(),
      status: true,
      isDeleted: false
    };

    this.colorService.addColor(color).subscribe({
      next: (response) => {
        this.alertifyService.success('Color added successfully');
        this.router.navigate(['/colors']);
      },
      error: (error) => {
        this.alertifyService.error('Error adding color: ' + error.message);
      }
    });
  }

  updateColor(): void {
    const color: Color = {
      id: this.colorId,
      name: this.colorForm.value.name,
      hexCode: this.colorForm.value.hexCode,
      createdUserId: this.color.createdUserId,
      createdDate: this.color.createdDate,
      lastUpdatedUserId: 0,
      lastUpdatedDate: new Date(),
      status: this.color.status,
      isDeleted: this.color.isDeleted
    };

    this.colorService.updateColor(color).subscribe({
      next: (response) => {
        this.alertifyService.success('Color updated successfully');
        this.router.navigate(['/colors']);
      },
      error: (error) => {
        this.alertifyService.error('Error updating color: ' + error.message);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/colors']);
  }

  markFormGroupTouched(): void {
    Object.keys(this.colorForm.controls).forEach(key => {
      const control = this.colorForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.colorForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      return `${fieldName} must not exceed ${control.errors?.['maxlength'].requiredLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return `${fieldName} must be a valid hex color code (e.g., #FF0000 or #F00)`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.colorForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getPageTitle(): string {
    return this.isEditMode ? 'Edit Color' : 'Add Color';
  }
}
