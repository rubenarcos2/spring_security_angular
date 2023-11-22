import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, first } from 'rxjs';
import jsPDF, { CellConfig } from 'jspdf';
import { SupplierService } from 'src/app/services/supplier.service';
import autoTable, { ColumnInput } from 'jspdf-autotable';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  private _products?: Product[];
  private _links?: any[];
  protected isPrintingPDF = false;
  protected isSearching = false;
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();
  private subs3: Subscription = new Subscription();
  private subs4: Subscription = new Subscription();
  private subs5: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private supplierService: SupplierService,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  /**
   * This function start on event page
   *
   */
  ngOnInit() {
    //Get all products of backend
    this.subs = this.productService
      .getAll('')
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
            if (res._links.self) {
              this._links.push(res._links.self);
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
   * This function execute on event delete button
   *
   * Detect if user confirm the action and proced to delete this product
   *
   */
  deleteProduct(name: any, id: any) {
    if (window.confirm('¿Seguro que desea borrar el producto ' + name + '?')) {
      const product = this.products!.find(x => x.id === id);

      //Get all products of backend
      this.subs2 = this.productService.delete(product).subscribe({
        next: result => {
          //Filter only selected product
          this._products = this.products!.filter(x => x.id !== id);
          let msg = JSON.parse(JSON.stringify(result));
          this.toastr.success(msg.message);
        },
        error: error => {
          this.toastr.error(error ? error : 'Operación no autorizada');
        },
      });
    }
  }

  /**
   * When load image remove spinner
   */
  onLoadImg(event: any) {
    event.srcElement.classList = '';
  }

  /**
   * Get a group of goods receipt of paginate selected
   */
  onChangePagination(event: any): void {
    event.preventDefault();

    //Get all products paginated
    this.subs3 = this.productService
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
            if (res._links.self) {
              this._links.push(res._links.self);
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
   * Get all products and send to generate PDF
   *
   */
  productsToPDF() {
    this.isPrintingPDF = true;

    //Get all products of backend
    this.subs4 = this.productService.getAllNoPaginated().subscribe({
      next: result => {
        let products = JSON.parse(JSON.stringify(result));
        products.sort((a: { id: number }, b: { id: number }) => a.id - b.id);
        let index = 0;
        products.forEach((prod: { stock: string; supplier: string; image: any; id: string }) => {
          delete prod.image;
          prod.id = String(prod.id);
          prod.supplier = String(prod.supplier);
          prod.stock = String(prod.stock);

          this.subs5 = this.supplierService.getById(prod.id).subscribe({
            next: result => {
              let res = JSON.parse(JSON.stringify(result));
              prod.supplier = String(res.name);
              if (index == products.length - 1) {
                this.generatePDF(products);
                this.isPrintingPDF = false;
              }
              index++;
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
   * Generate PDF document with jspdf library
   *
   */
  generatePDF(products: any) {
    let doc = new jsPDF({ putOnlyUsedFonts: true, orientation: 'portrait' });

    let pages = doc.getNumberOfPages();
    let pageWidth = doc.internal.pageSize.width; //Optional
    let pageHeight = doc.internal.pageSize.height; //Optional

    //Parser of table's columns name
    let columns: ColumnInput[] = [
      {
        title: 'Código',
        key: 'id',
      },
      {
        title: 'Nombre',
        key: 'name',
      },
      {
        title: 'Descripción',
        key: 'description',
      },
      {
        title: 'Proveedor',
        key: 'supplier',
      },
      {
        title: 'Precio',
        key: 'price',
      },
      {
        title: 'Stock',
        key: 'stock',
      },
    ];

    autoTable(doc, {
      columns: columns,
      body: products,
      margin: { top: 25 },
      headStyles: { fillColor: [253, 199, 60], textColor: 'black' },
    });

    pages = doc.getNumberOfPages();

    //Footer with page number
    for (let j = 1; j < pages + 1; j++) {
      let horizontalPos = pageWidth / 2; //Can be fixed number
      let verticalPos = pageHeight - 5; //Can be fixed number
      doc.setFontSize(10);
      doc.text('Informe de todos los productos', pageWidth / 2, 15, { align: 'center' });
      doc.addImage('../../assets/img/icons/gesmerca.png', 'PNG', 190, 5, 15, 15);

      doc.setPage(j);
      doc.text(`${j} de ${pages}`, horizontalPos, verticalPos, { align: 'center' });
    }

    doc.save('listado_productos.pdf');
  }

  /**
   * Get a text and search on server
   *
   */
  search(text: string, event: Event) {
    this.isSearching = true;
    let btn = event.target as HTMLButtonElement;
    if (btn.textContent != 'Quitar filtro') {
      if (text != '') {
        //Get all products of backend
        this.subs = this.productService.getAllNoPaginated().subscribe({
          next: result => {
            let res = JSON.parse(JSON.stringify(result)) as Product[];
            this._products = res.filter(
              e =>
                e.name?.includes(text) ||
                e.description == new Text(text) ||
                e.price == Number(text.replace(',', '.')) ||
                e.stock == Number(text)
            );
            this._links = undefined;
            document
              .getElementById('search-report')
              ?.getElementsByTagName('button')[0]
              .setAttribute('class', 'btn-danger');
            document
              .getElementById('search-report')!
              .getElementsByTagName('button')[0].textContent = 'Quitar filtro';
            this.isSearching = false;
          },
          error: error => {
            this.toastr.error(error ? error : 'No se puede conectar con el servidor');
          },
        });
      }
    } else {
      //Get all products of backend
      this.subs = this.productService
        .getAll()
        .pipe(first())
        .subscribe({
          next: result => {
            let res = JSON.parse(JSON.stringify(result));
            this._links = res.links;
            this._products = res.data;
            document
              .getElementById('search-report')
              ?.getElementsByTagName('button')[0]
              .setAttribute('class', '');
            document
              .getElementById('search-report')!
              .getElementsByTagName('button')[0].textContent = 'Buscar';
            document.getElementById('search-report')!.getElementsByTagName('input')[0].value = '';
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
    this.subs5.unsubscribe();
  }

  get products() {
    return this._products;
  }

  get links() {
    return this._links;
  }
}
