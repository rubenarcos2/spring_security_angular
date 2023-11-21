import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SupplierEditComponent } from './edit.component';

describe('ProductEditComponent', () => {
  let component: SupplierEditComponent;
  let fixture: ComponentFixture<SupplierEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
        }),
      ],
      declarations: [SupplierEditComponent],
      providers: [HttpClient, HttpHandler],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
