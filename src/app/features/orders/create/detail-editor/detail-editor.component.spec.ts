import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEditorComponent } from './detail-editor.component';

describe('DetailEditorComponent', () => {
  let component: DetailEditorComponent;
  let fixture: ComponentFixture<DetailEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
