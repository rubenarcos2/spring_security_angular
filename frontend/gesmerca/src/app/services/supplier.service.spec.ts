import { TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SupplierService } from './supplier.service';

describe('SupplierService', () => {
  let service: SupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
        }),
      ],
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(SupplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
