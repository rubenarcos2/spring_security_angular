import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

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
      declarations: [LoginComponent],
      providers: [HttpClient, HttpHandler, AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    authService = TestBed.inject(AuthService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send login credentials', () => {
    let f = new FormBuilder();
    component.loginForm = f.group({
      email: ['admin@admin.com'],
      password: ['administrador'],
    });
    authService.login(component.loginForm.value).subscribe({
      next: result => {
        let res = JSON.parse(JSON.stringify(result));
        expect(res.user.name).toEqual('Administrador');
      },
      error: error => {
        console.error(error);
      },
    });
  });
});
