import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, first } from 'rxjs';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import StringUtils from 'src/app/utils/stringsUtils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private _products?: Product[];
  private _links?: any[];
  protected isSearching = false;
  protected isFilter = false;
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();
  private subs3: Subscription = new Subscription();
  private subs4: Subscription = new Subscription();

  constructor(private productService: ProductService, private toastr: ToastrService) {}

  /**
   * Detect key enter pressed on filterSearch box
   *
   */
  @HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isFilter) {
      this.search();
    }
  }

  /**
   * This function start on event page
   *
   * Load y fill init page all products
   *
   */
  ngOnInit(): void {
    //Get all products of backend
    this.subs = this.productService
      .getAll()
      .pipe(first())
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          this._links = [];
          if (res.page.totalPages > 1) {
            if (res._links.first) {
              this._links.push(res._links.first);
              this._links[this._links.length - 1].label = 'Primero';
              this._links[this._links.length - 1].href = this._links[
                this._links.length - 1
              ].href.replace('undefined&', '');
            }
            if (res._links.prev) {
              this._links.push(res._links.prev);
              this._links[this._links.length - 1].label = 'Anterior';
              this._links[this._links.length - 1].href = this._links[
                this._links.length - 1
              ].href.replace('undefined&', '');
            }
            if (res._links.next) {
              this._links.push(res._links.next);
              this._links[this._links.length - 1].label = 'Siguiente';
              this._links[this._links.length - 1].href = this._links[
                this._links.length - 1
              ].href.replace('undefined&', '');
            }
            if (res._links.last) {
              this._links.push(res._links.last);
              this._links[this._links.length - 1].label = 'Último';
              this._links[this._links.length - 1].href = this._links[
                this._links.length - 1
              ].href.replace('undefined&', '');
            }
          }
          this._products = res._embedded.productModelList;
        },
        error: error => {
          this.toastr.error(error ? error : 'No se puede conectar con el servidor');
        },
      });
  }

  /**
   * Unset css class on load event image
   */
  onLoadImg(event: any): void {
    event.srcElement.classList = '';
  }

  /**
   * Get a group of goods receipt of paginate selected
   */
  onChangePagination(event: any): void {
    event.preventDefault();
    this.subs2 = this.productService
      .getAll(event.target.href.split('?')[1])
      .pipe(first())
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          this._links = [];
          if (res.page.totalPages > 1) {
            if (res._links.first) {
              this._links.push(res._links.first);
              this._links[this._links.length - 1].label = 'Primero';
              this._links[this._links.length - 1].href = this._links[
                this._links.length - 1
              ].href.replace('undefined&', '');
            }
            if (res._links.prev) {
              this._links.push(res._links.prev);
              this._links[this._links.length - 1].label = 'Anterior';
              this._links[this._links.length - 1].href = this._links[
                this._links.length - 1
              ].href.replace('undefined&', '');
            }
            if (res._links.next) {
              this._links.push(res._links.next);
              this._links[this._links.length - 1].label = 'Siguiente';
              this._links[this._links.length - 1].href = this._links[
                this._links.length - 1
              ].href.replace('undefined&', '');
            }
            if (res._links.last) {
              this._links.push(res._links.last);
              this._links[this._links.length - 1].label = 'Último';
              this._links[this._links.length - 1].href = this._links[
                this._links.length - 1
              ].href.replace('undefined&', '');
            }
          }
          this._products = res._embedded.productModelList;
        },
        error: error => {
          this.toastr.error(error ? error : 'No se puede conectar con el servidor');
        },
      });
  }

  /**
   * Get a text and search on server
   *
   */
  search() {
    const btn = document.getElementById('search-report')!.getElementsByTagName('button')[0];
    const filterBox = document.getElementById('filterSearch') as HTMLInputElement;
    const text = StringUtils.removeSpacesAccentsAndUpperCase(filterBox.value)!;
    if (btn.textContent != 'Quitar filtro') {
      if (text != '') {
        this.isSearching = true;
        this.isFilter = true;
        //Get all products of backend
        this.subs3 = this.productService.getAllNoPaginated().subscribe({
          next: result => {
            let res = JSON.parse(JSON.stringify(result)) as Product[];
            this._products = res.filter(
              (e: Product) =>
                StringUtils.removeSpacesAccentsAndUpperCase(e.name!).includes(text) ||
                StringUtils.removeSpacesAccentsAndUpperCase(e.description!).includes(text) ||
                e.price ==
                  Number(StringUtils.removeSpacesAccentsAndUpperCase(text).replace(',', '.'))
            );
            this._links = undefined;
            btn.setAttribute('class', 'btn-danger btn-sm mb-2');
            btn.textContent = 'Quitar filtro';
            this.isSearching = false;
          },
          error: error => {
            this.toastr.error(error ? error : 'No se puede conectar con el servidor');
          },
        });
      }
    } else {
      this.isSearching = true;
      this.isFilter = false;
      //Get all products of backend
      this.subs4 = this.productService
        .getAll()
        .pipe(first())
        .subscribe({
          next: result => {
            let res = JSON.parse(JSON.stringify(result));
            this._links = [];
            if (res.page.totalPages > 1) {
              if (res._links.first) {
                this._links.push(res._links.first);
                this._links[this._links.length - 1].label = 'Primero';
                this._links[this._links.length - 1].href = this._links[
                  this._links.length - 1
                ].href.replace('undefined&', '');
              }
              if (res._links.prev) {
                this._links.push(res._links.prev);
                this._links[this._links.length - 1].label = 'Anterior';
                this._links[this._links.length - 1].href = this._links[
                  this._links.length - 1
                ].href.replace('undefined&', '');
              }
              if (res._links.next) {
                this._links.push(res._links.next);
                this._links[this._links.length - 1].label = 'Siguiente';
                this._links[this._links.length - 1].href = this._links[
                  this._links.length - 1
                ].href.replace('undefined&', '');
              }
              if (res._links.last) {
                this._links.push(res._links.last);
                this._links[this._links.length - 1].label = 'Último';
                this._links[this._links.length - 1].href = this._links[
                  this._links.length - 1
                ].href.replace('undefined&', '');
              }
            }
            this._products = res._embedded.productModelList;
            btn.setAttribute('class', 'btn-secondary btn-sm mb-2');
            btn.textContent = 'Filtrar';
            btn.value = '';
            filterBox.value = '';
            this.isSearching = false;
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

  get products() {
    return this._products;
  }

  get links() {
    return this._links;
  }
}
