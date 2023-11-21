import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { GoodsreceiptService } from './goodsreceipt.service';

describe('GoodsreceiptService', () => {
  let service: GoodsreceiptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
        }),
      ],
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(GoodsreceiptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
