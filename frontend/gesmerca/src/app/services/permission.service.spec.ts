import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  let service: PermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
        }),
      ],
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(PermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
