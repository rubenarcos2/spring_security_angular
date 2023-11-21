import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  returnUrl!: string;
  isSubmitted: boolean = false;
  private subs: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private configService: ConfigService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * This function start on event page
   *
   */
  ngOnInit(): void {
    let expired;
    //Get url's parameter
    this.route.queryParams.subscribe(param => (expired = param['expired']));
    if (expired) {
      document.getElementsByTagName('h2')[0].textContent = 'La sesión ha expirado';
      document.getElementsByTagName('h5')[0].textContent = 'Por favor, identifíquese de nuevo';
    }

    this.loginForm = this.formBuilder.group({
      userName: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  /**
   * This function execute on form submit
   *
   */
  onSubmit() {
    this.isSubmitted = true;
    this.subs = this.authService.login(this.loginForm.value).subscribe({
      next: result => {
        this.configService.getAllConfigsOfUser(result.id).subscribe();
        this.authService.profile().subscribe();
        this.toastr.info('Bienvenido ' + result.name);
        this.router.navigate([this.returnUrl || '/perfil']);
      },
      error: error => {
        this.toastr.error(error ? error : 'No se puede conectar con el servidor');
      },
    });
    this.subs.add(() => {
      this.isSubmitted = false;
    });
  }

  /**
   * This function start on destroy event page
   *
   * Unsuscribe all observable suscriptions
   *
   */
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get loginFormControls() {
    return this.loginForm.controls;
  }
}
