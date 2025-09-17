import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailEditorComponent } from './detail-editor.component';
import { ProductsService } from '../../../products/service/ProductsService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DetailEditorComponent', () => {
  let component: DetailEditorComponent;
  let fixture: ComponentFixture<DetailEditorComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    productsServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getProducts',
    ]);
    productsServiceSpy.getProducts.and.returnValue(
      of([
        { id: 1, name: 'Product A', price: 10 },
        { id: 2, name: 'Product B', price: 20 },
      ])
    );

    await TestBed.configureTestingModule({
      imports: [
        DetailEditorComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProducts and load products in constructor', () => {
    expect(productsServiceSpy.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.products[0].name).toBe('Product A');
  });

  it('should update unitPrice on productId change in ngOnInit', () => {
    component.products = [
      { id: 1, name: 'Product A', price: 10 },
      { id: 2, name: 'Product B', price: 20 },
    ];
    component.detailForm.get('productId')?.setValue(2);
    fixture.detectChanges();
    expect(component.detailForm.get('unitPrice')?.value).toBe(20);
  });

  it('should emit addDetail and reset form on addAndReset', () => {
    spyOn(component.addDetail, 'emit');
    component.products = [{ id: 1, name: 'Product A', price: 10 }];
    component.detailForm.setValue({
      productId: 1,
      quantity: 2,
      unitPrice: 10,
    });
    component.addAndReset();
    expect(component.addDetail.emit).toHaveBeenCalledWith({
      productId: 1,
      quantity: 2,
      unitPrice: 10,
      product: { id: 1, name: 'Product A', price: 10 },
    });
    expect(component.detailForm.get('productId')?.value).toBe('');
    expect(component.detailForm.get('quantity')?.value).toBe(1);
  });
});
