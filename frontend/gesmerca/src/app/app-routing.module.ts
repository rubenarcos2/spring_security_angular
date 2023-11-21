import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
//Login, profile, register and not found page
import { LoginComponent } from './components/auth/login/login.component';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
//Home
import { HomeComponent } from './components/home/home.component';
//Products
import { ProductListComponent } from './components/products/list/list.component';
import { ProductEditComponent } from './components/products/edit/edit.component';
import { ProductAddComponent } from './components/products/add/add.component';
//Configurations of user and general
import { ConfigListComponent } from './components/config/list/list.component';
import { ConfigGeneralListComponent } from './components/config/general-list/list.component';
import { ConfigGeneralEditComponent } from './components/config/edit/edit.component';
//Roles and permissions
import { RoleListComponent } from './components/role/list/list.component';
import { PermissionsListComponent } from './components/permissions/list/list.component';
import { SupplierListComponent } from './components/suppliers/list/list.component';
import { SupplierAddComponent } from './components/suppliers/add/add.component';
import { SupplierEditComponent } from './components/suppliers/edit/edit.component';
import { GoodsReceiptListComponent } from './components/goodsreceipt/list/list.component';
import { GoodsReceiptAddComponent } from './components/goodsreceipt/add/add.component';
import { GoodsReceiptEditComponent } from './components/goodsreceipt/edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registro',
    component: RegisterComponent,
  },
  {
    path: 'perfil',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'productos',
    component: ProductListComponent,
    canActivate: [AuthGuard],
    data: { permission: ['product-list'] },
  },
  {
    path: 'productos/nuevo',
    component: ProductAddComponent,
    canActivate: [AuthGuard],
    data: { permission: ['product-create'] },
  },
  {
    path: 'productos/editar/:id',
    component: ProductEditComponent,
    canActivate: [AuthGuard],
    data: { permission: ['product-edit'] },
  },
  {
    path: 'proveedores',
    component: SupplierListComponent,
    canActivate: [AuthGuard],
    data: { permission: ['supplier-list'] },
  },
  {
    path: 'proveedores/nuevo',
    component: SupplierAddComponent,
    canActivate: [AuthGuard],
    data: { permission: ['supplier-create'] },
  },
  {
    path: 'proveedores/editar/:id',
    component: SupplierEditComponent,
    canActivate: [AuthGuard],
    data: { permission: ['supplier-edit'] },
  },
  {
    path: 'recepcion',
    component: GoodsReceiptListComponent,
    canActivate: [AuthGuard],
    data: { permission: ['goodsreceipt-list'] },
  },
  {
    path: 'recepcion/nuevo',
    component: GoodsReceiptAddComponent,
    canActivate: [AuthGuard],
    data: { permission: ['goodsreceipt-create'] },
  },
  {
    path: 'recepcion/editar/:id',
    component: GoodsReceiptEditComponent,
    canActivate: [AuthGuard],
    data: { permission: ['goodsreceipt-edit'] },
  },
  {
    path: 'config',
    component: ConfigListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'config/general',
    component: ConfigGeneralListComponent,
    canActivate: [AuthGuard],
    data: { permission: ['config-list'] },
  },
  {
    path: 'config/general/editar/:id',
    component: ConfigGeneralEditComponent,
    canActivate: [AuthGuard],
    data: { permission: ['config-edit'] },
  },
  {
    path: 'roles',
    component: RoleListComponent,
    canActivate: [AuthGuard],
    data: { permission: ['role-list'] },
  },
  {
    path: 'permisos',
    component: PermissionsListComponent,
    canActivate: [AuthGuard],
    data: { permission: ['permission-list'] },
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
