import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DetailEditorComponent } from './detail-editor.component';

describe('DetailEditorComponent', () => {
  let component: DetailEditorComponent;
  let fixture: ComponentFixture<DetailEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetailEditorComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
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
});
