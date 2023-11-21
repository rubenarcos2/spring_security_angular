import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ConfigListComponent } from './list.component';

describe('ConfigListComponent', () => {
  let component: ConfigListComponent;
  let fixture: ComponentFixture<ConfigListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
        }),
      ],
      declarations: [ConfigListComponent],
      providers: [HttpClient, HttpHandler],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
