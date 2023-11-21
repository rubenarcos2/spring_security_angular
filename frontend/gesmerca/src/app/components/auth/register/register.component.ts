import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  isSubmitted: boolean = false;
  private subs: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  /**
   * This function start on event page
   *
   */
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)]],
    });
  }

  /**
   * This function execute on form submit
   *
   * Send form data to backend and register the new user data
   *
   */
  onSubmit() {
    this.isSubmitted = true;
    this.subs = this.authService.register(this.registerForm.value).subscribe({
      next: result => {
        this.router.navigate(['/']).then(() => {
          let msg = JSON.parse(JSON.stringify(result));
          this.toastr.success(msg.message);
        });
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

  get registerFormControls() {
    return this.registerForm.controls;
  }
}
