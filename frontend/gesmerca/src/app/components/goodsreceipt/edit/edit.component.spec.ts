import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { GoodsReceiptEditComponent } from './edit.component';
import { AuthService } from 'src/app/services/auth.service';
import { GoodsreceiptService } from 'src/app/services/goodsreceipt.service';
import { ProductService } from 'src/app/services/product.service';
import { DatePipe } from '@angular/common';

describe('GoodsReceiptEditComponent', () => {
  let component: GoodsReceiptEditComponent;
  let fixture: ComponentFixture<GoodsReceiptEditComponent>;

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
      declarations: [GoodsReceiptEditComponent],
      providers: [
        HttpClient,
        HttpHandler,
        GoodsreceiptService,
        ProductService,
        AuthService,
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoodsReceiptEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
