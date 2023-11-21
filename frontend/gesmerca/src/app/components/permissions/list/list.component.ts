import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Permission } from 'src/app/models/permission';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class PermissionsListComponent implements OnInit, OnDestroy {
  private _users!: User[];
  private _permissions!: Permission[];
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();

  constructor(
    protected authService: AuthService,
    private permissionService: PermissionService,
    private toastr: ToastrService
  ) {}

  /**
   * This function start on init event page
   *
   * Bring all users of the server, read and assign permissions to each user and at the end enable all elements of the screen.
   *
   */
  ngOnInit(): void {
    //Get all users of backend
    this.subs = this.authService.getAllUsers().subscribe({
      next: result => {
        this._users = JSON.parse(JSON.stringify(result));
        //Get all permissions of backend
        this.permissionService.getAll().subscribe({
          next: result => {
            this._permissions = JSON.parse(JSON.stringify(result));
          },
          error: error => {
            this.toastr.error(error ? error : 'No se puede conectar con el servidor');
          },
        });
        this._users.forEach(u => {
          //Get user's permission of backend
          this.permissionService.getPermissionsUser(u.id).subscribe({
            next: result => {
              let permissions = JSON.parse(JSON.stringify(result));
              u.permissions = permissions;
              if (u.id == this.users.at(this.users.length - 1)?.id) {
                this.setEnabledElements();
                this.selectPermissionOfCmbUser();
              }
            },
            error: error => {
              this.toastr.error(error ? error : 'No se puede conectar con el servidor');
            },
          });
        });
      },
      error: error => {
        this.toastr.error(error ? error : 'No se puede conectar con el servidor');
      },
    });
  }

  /**
   * Read user permissions and check this user permissions on checkbox list
   */
  selectPermissionOfCmbUser() {
    //Deselect all checkbox of permissions
    this.permissions.forEach(p => {
      let chk = document.getElementById('chk-' + p.id) as HTMLInputElement;
      chk.checked = false;
    });
    //Check checkbox when user permissions exist
    let cmb = document.getElementById('select-user') as HTMLSelectElement;
    let user = cmb.value.substring('user-'.length);
    this.users.forEach(u => {
      if (u.id == Number(user)) {
        u.permissions?.forEach(p => {
          let chk = document.getElementById('chk-' + p.id) as HTMLInputElement;
          chk.checked = true;
        });
      }
    });
  }

  /**
   * Enable screen elements that was disabled
   */
  setEnabledElements() {
    let selectUser = document.getElementById('select-user') as HTMLSelectElement;
    selectUser.removeAttribute('disabled');
    let btnSave = document.getElementById('btn-save') as HTMLButtonElement;
    btnSave.removeAttribute('disabled');
    this.permissions.forEach(p => {
      let chk = document.getElementById('chk-' + p.id) as HTMLInputElement;
      chk.removeAttribute('disabled');
    });
  }

  /**
   * Consume on server api endpoint /permission/user/${id} with combobox selected user and checkbox permissions checked
   * @param  {Event} event The event save button
   */
  updatePermissions(event: any) {
    let btnSave = event.target;
    let cmb = document.getElementById('select-user') as HTMLSelectElement;
    let userId = cmb.value.substring('user-'.length);
    if (window.confirm('¿Está seguro que desea cambiar el rol al usuario?')) {
      let permListChecked: Array<String> = [];
      this.permissions.forEach(p => {
        let chk = document.getElementById('chk-' + p.id) as HTMLInputElement;
        if (chk.checked) permListChecked.push(chk.value);
      });
      let param = new FormData();
      param.append('permissions', JSON.stringify(permListChecked));
      this.subs2 = this.permissionService.setPermissionsUser(param, userId).subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          res.error ? this.toastr.error(res.error) : this.toastr.success(res.message);
        },
        error: error => {
          this.toastr.error(error ? error : 'No se puede conectar con el servidor');
        },
      });
    }
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
  }

  get users(): User[] {
    return this._users;
  }

  get permissions(): Permission[] {
    return this._permissions;
  }
}
