import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ProductEditorComponent } from './product-editor.component';
import { CategoryService } from '../../../api/services/category.service';

describe('ProductEditorComponent', () => {
  let component: ProductEditorComponent;
  let fixture: ComponentFixture<ProductEditorComponent>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;

  beforeEach(async () => {
    mockCategoryService = jasmine.createSpyObj('CategoryService', [
      'apiCategoryGet$Json',
    ]);
    mockCategoryService.apiCategoryGet$Json.and.returnValue(
      of([
        { id: 1, name: 'Beverages' },
        { id: 2, name: 'Desserts' },
      ])
    );

    await TestBed.configureTestingModule({
      imports: [
        ProductEditorComponent,
        BrowserAnimationsModule, // <-- Add this line
      ],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as invalid when required fields are empty', () => {
    component.productForm.setValue({
      id: null, // <-- Add this line
      name: '',
      price: null,
      categoryId: null,
    });
    expect(component.productForm.invalid).toBeTrue();
  });

  it('should load categories', () => {
    expect(component.categories.length).toBe(2);
    expect(component.categories[0].name).toBe('Beverages');
    expect(component.categories[1].name).toBe('Desserts');
  });
});
