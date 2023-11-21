import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { GoodsreceiptService } from 'src/app/services/goodsreceipt.service';
import { DatePipe } from '@angular/common';
import { GoodsReceiptAddComponent } from './add.component';

describe('GoodsReceiptAddComponent', () => {
  let component: GoodsReceiptAddComponent;
  let fixture: ComponentFixture<GoodsReceiptAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
        }),
      ],
      declarations: [GoodsReceiptAddComponent],
      providers: [
        HttpClient,
        HttpHandler,
        GoodsreceiptService,
        SupplierService,
        ProductService,
        AuthService,
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoodsReceiptAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
