import { Component, OnDestroy, OnInit } from '@angular/core';
import { Config } from 'src/app/models/config';
import { ConfigService } from 'src/app/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, first } from 'rxjs';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ConfigGeneralListComponent implements OnInit, OnDestroy {
  private _configs?: Config[];
  private subs: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  /**
   * This function start on event page
   *
   * Get all general configs of the backend
   *
   */
  ngOnInit() {
    this.subs = this.configService
      .getAll()
      .pipe(first())
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          this._configs = res;
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

  get configs() {
    return this._configs;
  }
}
