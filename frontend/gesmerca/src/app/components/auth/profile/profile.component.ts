import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  protected _user!: User;
  private subs: Subscription = new Subscription();

  constructor(private authService: AuthService, private toastr: ToastrService) {}

  /**
   * This function start on event page
   *
   * Get login user's profile of the backend
   *
   */
  ngOnInit(): void {
    this.subs = this.authService.profile().subscribe({
      complete: () => {
        this._user = this.authService.user;
      },
      error: error => {
        this.toastr.error(error ? error : 'No se puede conectar con el servidor');
      },
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

  get user() {
    return this._user;
  }
}
