import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class RoleListComponent implements OnInit, OnDestroy {
  private _users!: User[];
  private _roles!: Role[];
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();
  private subs3: Subscription = new Subscription();
  private subs4: Subscription = new Subscription();

  constructor(
    protected authService: AuthService,
    private roleService: RoleService,
    private toastr: ToastrService
  ) {}

  /**
   * This function start on event page
   *
   */
  ngOnInit(): void {
    //Get all users of backend
    this.subs = this.authService.getAllUsers().subscribe({
      next: result => {
        this._users = JSON.parse(JSON.stringify(result));
        this._users.forEach(u => {
          //Get all roles of this user
          this.subs2 = this.roleService.getRoleUser(u.id).subscribe({
            next: result => {
              let rol = JSON.parse(JSON.stringify(result));
              this.selectCmbRole(u, rol);
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
    this.subs3 = this.roleService.getAll().subscribe({
      next: result => {
        this._roles = JSON.parse(JSON.stringify(result));
      },
      error: error => {
        this.toastr.error(error ? error : 'No se puede conectar con el servidor');
      },
    });
  }

  /**
   * This function execute on change event role combobox
   *
   * Detect if value is changed and set selected rol
   *
   * @param  {User} u The user selected
   * @param  {Role} rol The role selected
   */
  selectCmbRole(u: User, rol: Role) {
    u.roles?.push(rol);
    let sel = document.getElementById('select-roles-' + u.id) as HTMLSelectElement;
    let op = document.getElementById(u.id + '-' + rol) as HTMLOptionElement;
    sel.removeAttribute('disabled');
    op.selected = true;
    document.getElementById('btn-' + u.id)?.removeAttribute('disabled');
  }

  /**
   * This function execute on change event save button click
   *
   * Set roles for this user
   *
   * @param  {Event} event The event button click
   */
  updateRole(event: any) {
    let btnSave = event.target;
    let userId = btnSave.id.substring('btn-'.length);
    let select = document.getElementById('select-roles-' + userId) as HTMLSelectElement;
    var roleId = select.value.substring(select.value.indexOf('-') + 1);
    if (window.confirm('¿Está seguro que desea cambiar el rol al usuario?')) {
      let param = new FormData();
      param.append('id', roleId);

      //Set role of user to backend
      this.subs4 = this.roleService.setRoleUser(param, userId).subscribe({
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
    this.subs3.unsubscribe();
    this.subs4.unsubscribe();
  }

  get users(): User[] {
    return this._users;
  }

  get roles(): Role[] {
    return this._roles;
  }
}
