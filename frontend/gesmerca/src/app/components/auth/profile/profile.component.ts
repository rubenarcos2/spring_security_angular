import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CheckSessionService } from 'src/app/services/check-session.service';
import TokenUtils from 'src/app/utils/tokenUtils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  protected _user!: User;
  protected timeExpiredSession: number = 0;
  protected timeAdviceExpiredSession: number = 0;
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

    this.timeExpiredSession = TokenUtils.tokenExpirationTime() * 1000;
    this.timeAdviceExpiredSession =
      TokenUtils.tokenExpirationTime() * 1000 -
      CheckSessionService.SESSION_COURTESY_TIME -
      CheckSessionService.SESSION_USER_COUNT_DOWN_TIME;
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
