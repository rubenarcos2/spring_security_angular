import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Config } from 'src/app/models/config';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ConfigListComponent implements OnInit, OnDestroy {
  private _configs!: Config[];
  private _configsGeneral!: Config[];
  private _user!: User;
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();
  private subs3: Subscription = new Subscription();
  private subs4: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private toastr: ToastrService
  ) {}

  /**
   * This function start on event page
   *
   * Get all user's config of the backend
   *
   */
  ngOnInit(): void {
    this.subs = this.authService.profile().subscribe({
      complete: () => {
        this._user = this.authService.user;
        this.configService.getAllConfigsOfUser(this._user.id).subscribe({
          next: result => {
            this._configs = result;
          },
          error: error => {
            this.toastr.error(error ? error : 'No se puede conectar con el servidor');
          },
        });
        this.configService.getAll().subscribe({
          next: result => {
            this._configsGeneral = result;
            this.mixConfigsSpecifyWithGeneral();
          },
          error: error => {
            this.toastr.error(error ? error : 'No se puede conectar con el servidor');
          },
        });
      },
      error: error => {
        this.toastr.error(error ? error : 'No se puede conectar con el servidor');
      },
    });
  }

  /**
   * This function execute on change event checkbox
   *
   * Detect if delete or update this config
   *
   */
  onChangeCheckActive(event: any) {
    let name = event.target.id.substring('check-'.length);
    let check = document.getElementById(event.target.id);
    if (check !== null) {
      let switchValue = document.getElementById('switch-' + name) as HTMLInputElement;
      if (switchValue !== null) {
        if (!event.target.checked) {
          switchValue.setAttribute('disabled', '');
          let dataForm = new FormData();
          dataForm.append('name', name);
          this.subs2 = this.configService.deleteUserConfig(dataForm, this._user.id).subscribe({
            next: result => {
              let res = JSON.parse(JSON.stringify(result));
              this.toastr.success(res.message);
            },
            error: error => {
              this.toastr.error(error ? error : 'No se puede conectar con el servidor');
            },
          });
        } else {
          switchValue.removeAttribute('disabled');
          let dataForm = new FormData();
          dataForm.append('name', name);
          dataForm.append('value', String(switchValue.checked));
          let desc = document.getElementById('desc-' + name);
          if (desc !== null) dataForm.append('description', (desc as HTMLInputElement).value);

          this.subs3 = this.configService.updateUserConfig(dataForm, this._user.id).subscribe({
            next: result => {
              let res = JSON.parse(JSON.stringify(result));
              this.toastr.success(res.message);
            },
            error: error => {
              this.toastr.error(error ? error : 'No se puede conectar con el servidor');
            },
          });
        }
      }
    }
  }

  /**
   * This function execute on change event checkbox value
   *
   * Detect if update value of this config
   *
   */
  onChangeCheckValue(event: any) {
    let name = event.target.id.substring('switch-'.length);
    let dataForm = new FormData();
    dataForm.append('name', name);
    dataForm.append('value', event.target.checked);
    let desc = document.getElementById('desc-' + name) as HTMLInputElement;
    if (desc !== null) dataForm.append('description', desc.value);

    this.subs4 = this.configService.updateUserConfig(dataForm, this._user.id).subscribe({
      next: result => {
        let res = JSON.parse(JSON.stringify(result));
        this.toastr.success(res.message);
      },
      error: error => {
        this.toastr.error(error ? error : 'No se puede conectar con el servidor');
      },
    });
  }

  /**
   * Join general configs and user's config
   *
   */
  mixConfigsSpecifyWithGeneral(): void {
    this._configsGeneral.forEach(configGeneral => {
      let exist = false;
      this._configs.forEach(config => {
        if (config.name === configGeneral.name) exist = true;
      });
      if (!exist) this.configs.push(configGeneral);
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
    this.subs2.unsubscribe();
    this.subs3.unsubscribe();
    this.subs4.unsubscribe();
  }

  get configs(): Config[] {
    return this._configs;
  }
}
