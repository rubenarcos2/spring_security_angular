import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HomeComponent } from './components/home/home.component';
import { Meta } from '@angular/platform-browser';
import { ProductListComponent } from './components/products/list/list.component';
import { ProductEditComponent } from './components/products/edit/edit.component';
import { ProductAddComponent } from './components/products/add/add.component';
import { ConfigListComponent } from './components/config/list/list.component';
import { ConfigGeneralListComponent } from './components/config/general-list/list.component';
import { ConfigGeneralEditComponent } from './components/config/edit/edit.component';
import { RoleListComponent } from './components/role/list/list.component';
import { PermissionsListComponent } from './components/permissions/list/list.component';

import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { HelpComponent } from './components/help/help.component';
import { SupplierListComponent } from './components/suppliers/list/list.component';
import { SupplierEditComponent } from './components/suppliers/edit/edit.component';
import { SupplierAddComponent } from './components/suppliers/add/add.component';
import { GoodsReceiptListComponent } from './components/goodsreceipt/list/list.component';
import { GoodsReceiptAddComponent } from './components/goodsreceipt/add/add.component';
import { GoodsReceiptEditComponent } from './components/goodsreceipt/edit/edit.component';
import { CheckSessionComponent } from './components/check-session/check-session.component';
import { CanDeactivateBlockNavigationIfChange } from './guards/block-navigation-if-change.guard';

registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, //Auth
    RegisterComponent, //Auth
    ProfileComponent, //Auth
    NavBarComponent, //Navigation bar
    NotFoundComponent, //404 page
    HomeComponent, //Start page
    ProductListComponent, //Products
    ProductEditComponent, //Products
    ProductAddComponent, //Products
    ConfigListComponent, //Config
    ConfigGeneralListComponent, //Config
    ConfigGeneralEditComponent, //Config
    RoleListComponent, //Roles and permissions
    PermissionsListComponent, //Roles and permissions
    HelpComponent, //Help
    SupplierListComponent, //Supplier
    SupplierEditComponent, //Supplier
    SupplierAddComponent, //Supplier
    GoodsReceiptListComponent, //Goods Receipt
    GoodsReceiptAddComponent, //Goods Receipt
    GoodsReceiptEditComponent, //Goods Receipt
    CheckSessionComponent, //Check session
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    Meta,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    DatePipe,
    CanDeactivateBlockNavigationIfChange,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
