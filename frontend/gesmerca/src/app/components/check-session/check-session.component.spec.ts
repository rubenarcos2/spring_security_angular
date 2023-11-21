import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth.service';
import { CheckSessionComponent } from './check-session.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

describe('CheckSessionComponent', () => {
  let component: CheckSessionComponent;
  let fixture: ComponentFixture<CheckSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
        }),
      ],
      declarations: [CheckSessionComponent],
      providers: [HttpClient, HttpHandler, AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
