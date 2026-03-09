import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalsampleComponent } from './signalsample.component';

describe('SignalsampleComponent', () => {
  let component: SignalsampleComponent;
  let fixture: ComponentFixture<SignalsampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalsampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalsampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
