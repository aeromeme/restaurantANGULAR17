import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderCreateComponent } from './order-create.component';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../api/services/order.service';

describe('OrderCreateComponent', () => {
  let component: OrderCreateComponent;
  let fixture: ComponentFixture<OrderCreateComponent>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        OrderCreateComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update orderDetails when openDetailDialog emits a new detail', () => {
    // Arrange: mock dialogRef and addDetail subject
    const addDetailSubject = new Subject<any>();
    const dialogRefMock = {
      componentInstance: { addDetail: addDetailSubject.asObservable() },
      afterClosed: () => of(true),
    };
    matDialogSpy.open.and.returnValue(dialogRefMock as any);

    // Act: call openDetailDialog
    component.openDetailDialog();

    // Emit a new detail
    addDetailSubject.next({
      productId: 1,
      quantity: 2,
      unitPrice: 10,
    });

    // Assert: orderDetails should be updated
    expect(component.orderDetails.length).toBe(1);
    expect(component.orderDetails[0].productId).toBe(1);
    expect(component.orderDetails[0].quantity).toBe(2);
    expect(component.orderDetails[0].unitPrice).toBe(10);
    expect(component.orderDetails[0].amount).toBe(20);
  });

  it('should call apiOrderIdGet$Json in ngOnInit when id param is present', () => {
    // Arrange: create a spy for OrderService
    const orderServiceSpy = jasmine.createSpyObj('OrderService', [
      'apiOrderIdGet$Json',
      'apiOrderIdPut$Json',
      'apiOrderPost$Json',
    ]);
    orderServiceSpy.apiOrderIdGet$Json.and.returnValue(
      of({
        orderId: 123,
        customerName: 'Test Customer',
        orderDate: '2025-09-17',
        totalAmount: 50,
        orderDetails: [
          { productId: 1, quantity: 2, unitPrice: 25, amount: 50 },
        ],
      })
    );

    // Reconfigure TestBed with the spy and a route param
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        OrderCreateComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: OrderService, useValue: orderServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ id: 123 }),
            snapshot: { queryParamMap: { get: () => '123' } },
          },
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
      ],
    }).compileComponents();

    const fixtureWithOrderService =
      TestBed.createComponent(OrderCreateComponent);
    const componentWithOrderService = fixtureWithOrderService.componentInstance;
    fixtureWithOrderService.detectChanges();

    // Assert
    expect(orderServiceSpy.apiOrderIdGet$Json).toHaveBeenCalledWith({
      id: 123,
    });
    expect(componentWithOrderService.orderForm.value.customerName).toBe(
      'Test Customer'
    );
    expect(componentWithOrderService.orderDetails.length).toBe(1);
    expect(componentWithOrderService.orderDetails[0].productId).toBe(1);
  });
});
