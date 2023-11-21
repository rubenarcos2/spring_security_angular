import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { GoodsreceiptService } from 'src/app/services/goodsreceipt.service';
import { AuthService } from 'src/app/services/auth.service';
import { GoodsReceiptListComponent } from './list.component';

describe('GoodsReceiptListComponent', () => {
  let component: GoodsReceiptListComponent;
  let fixture: ComponentFixture<GoodsReceiptListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
        }),
      ],
      declarations: [GoodsReceiptListComponent],
      providers: [HttpClient, HttpHandler, DatePipe, AuthService, GoodsreceiptService],
    }).compileComponents();

    fixture = TestBed.createComponent(GoodsReceiptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
