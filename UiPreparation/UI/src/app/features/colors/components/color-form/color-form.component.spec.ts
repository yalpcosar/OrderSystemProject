import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ColorFormComponent } from './color-form.component';
import { PColorService } from '../../../../core/components/admin/pcolor/services/PColor.service';
import { AlertifyService } from '../../../../core/services/alertify.service';

describe('ColorFormComponent', () => {
  let component: ColorFormComponent;
  let fixture: ComponentFixture<ColorFormComponent>;
  let mockColorService: jasmine.SpyObj<PColorService>;
  let mockAlertifyService: jasmine.SpyObj<AlertifyService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    const colorServiceSpy = jasmine.createSpyObj('PColorService', ['getColorById', 'addColor', 'updateColor']);
    const alertifyServiceSpy = jasmine.createSpyObj('AlertifyService', ['success', 'error']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ColorFormComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: PColorService, useValue: colorServiceSpy },
        { provide: AlertifyService, useValue: alertifyServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorFormComponent);
    component = fixture.componentInstance;
    mockColorService = TestBed.inject(PColorService) as jasmine.SpyObj<PColorService>;
    mockAlertifyService = TestBed.inject(AlertifyService) as jasmine.SpyObj<AlertifyService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form with required validators', () => {
    component.ngOnInit();
    expect(component.colorForm.get('name')?.hasError('required')).toBeTruthy();
    expect(component.colorForm.get('hexCode')?.hasError('required')).toBeFalsy();
  });

  it('should validate code format', () => {
    component.ngOnInit();
    const codeControl = component.colorForm.get('hexCode');
    
    codeControl?.setValue('#FF0000');
    expect(codeControl?.valid).toBeTruthy();
    
    codeControl?.setValue('#F00');
    expect(codeControl?.valid).toBeTruthy();
    
    codeControl?.setValue('invalid');
    expect(codeControl?.hasError('pattern')).toBeTruthy();
  });

  it('should be in add mode when no id provided', () => {
    component.ngOnInit();
    expect(component.isEditMode).toBeFalsy();
    expect(component.getPageTitle()).toBe('Add Color');
  });

  it('should be in edit mode when id provided', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
    const mockColor = { 
      id: 1, 
      name: 'Red', 
      hexCode: '#FF0000',
      createdUserId: 1,
      createdDate: new Date(),
      lastUpdatedUserId: 1,
      lastUpdatedDate: new Date(),
      status: true,
      isDeleted: false
    };
    mockColorService.getColorById.and.returnValue(of(mockColor));
    
    component.ngOnInit();
    expect(component.isEditMode).toBeTruthy();
    expect(component.getPageTitle()).toBe('Edit Color');
  });

  it('should get error message for required field', () => {
    component.ngOnInit();
    const nameControl = component.colorForm.get('name');
    nameControl?.markAsTouched();
    expect(component.getErrorMessage('name')).toBe('name is required');
  });

  it('should get error message for pattern validation', () => {
    component.ngOnInit();
    const codeControl = component.colorForm.get('hexCode');
    codeControl?.setValue('invalid');
    codeControl?.markAsTouched();
    expect(component.getErrorMessage('hexCode')).toBe('hexCode must be a valid hex color code (e.g., #FF0000 or #F00)');
  });
});
