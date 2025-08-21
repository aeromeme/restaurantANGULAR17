import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductsService } from './service/ProductsService';
import { CategoryService } from '../../api/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    productsServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getProducts',
      'createProduct',
      'updateProduct',
      'deleteProduct',
    ]);
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'apiCategoryGet$Json',
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products and categories on init', () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Test',
        price: 10,
        stock: 5,
        category: { id: 1, name: 'Cat' },
      },
    ];
    const mockCategories = [{ id: 1, name: 'Cat' }];
    productsServiceSpy.getProducts.and.returnValue(of(mockProducts));
    categoryServiceSpy.apiCategoryGet$Json.and.returnValue(of(mockCategories));

    component.ngOnInit();

    expect(productsServiceSpy.getProducts).toHaveBeenCalled();
    expect(categoryServiceSpy.apiCategoryGet$Json).toHaveBeenCalled();
  });

  it('should add a product after successful creation', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed: of({ name: 'New', price: 1, stock: 1, categoryId: 1 }),
    });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);
    productsServiceSpy.createProduct.and.returnValue(
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

    expect(productsServiceSpy.createProduct).toHaveBeenCalled();
  });

  it('should remove a product after successful deletion', () => {
    productsServiceSpy.deleteProduct.and.returnValue(of(void 0));
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
    expect(productsServiceSpy.deleteProduct).toHaveBeenCalledWith(1);
  });

  it('should handle error when deleting product', () => {
    spyOn(window, 'alert');
    productsServiceSpy.deleteProduct.and.returnValue(
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
