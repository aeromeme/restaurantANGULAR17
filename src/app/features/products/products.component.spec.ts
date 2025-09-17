import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductsService } from '../../api/services/products.service';
import { CategoryService } from '../../api/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    productsServiceSpy = jasmine.createSpyObj('ProductsService', [
      'apiProductsGet$Json',
      'apiProductsPost$Json',
      'apiProductsIdPut$Json',
      'apiProductsIdDelete',
    ]);
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'apiCategoryGet$Json',
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    productsServiceSpy.apiProductsGet$Json.and.returnValue(of([]));
    categoryServiceSpy.apiCategoryGet$Json.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, HttpClientTestingModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products and categories on init', () => {
    expect(productsServiceSpy.apiProductsGet$Json).toHaveBeenCalled();
    expect(categoryServiceSpy.apiCategoryGet$Json).toHaveBeenCalled();
  });

  it('should add a product after successful creation', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed: of({ name: 'New', price: 1, stock: 1, categoryId: 1 }),
    });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);
    productsServiceSpy.apiProductsPost$Json.and.returnValue(
      of({
        id: 2,
        name: 'New',
        price: 1,
        stock: 1,
        category: { id: 1, name: 'Cat' },
      })
    );

    component.products = [];
    component.openProductPopup();

    expect(productsServiceSpy.apiProductsPost$Json).toHaveBeenCalled();
  });

  it('should remove a product after successful deletion', () => {
    productsServiceSpy.apiProductsIdDelete.and.returnValue(of(void 0));
    component.products = [
      {
        id: 1,
        name: 'Test',
        price: 10,
        stock: 5,
        category: { id: 1, name: 'Cat' },
      },
    ];
    component.deleteProduct(component.products[0]);
    expect(productsServiceSpy.apiProductsIdDelete).toHaveBeenCalledWith({
      id: 1,
    });
  });

  it('should handle error when deleting product', () => {
    spyOn(window, 'alert');
    productsServiceSpy.apiProductsIdDelete.and.returnValue(
      throwError(() => new Error('Delete failed'))
    );
    component.products = [
      {
        id: 1,
        name: 'Test',
        price: 10,
        stock: 5,
        category: { id: 1, name: 'Cat' },
      },
    ];
    component.deleteProduct(component.products[0]);
    expect(window.alert).toHaveBeenCalledWith('Failed to delete product.');
  });
});
