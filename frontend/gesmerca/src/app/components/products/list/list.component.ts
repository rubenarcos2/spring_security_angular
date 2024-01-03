import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, first } from 'rxjs';
import jsPDF, { CellConfig } from 'jspdf';
import { SupplierService } from 'src/app/services/supplier.service';
import autoTable, { CellDef, ColumnInput } from 'jspdf-autotable';
import StringUtils from 'src/app/utils/stringsUtils';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  private _products?: Product[];
  private _links?: any[];
  protected isPrintingPDF = false;
  protected isSearching = false;
  protected isFilter = false;
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();
  private subs3: Subscription = new Subscription();
  private subs4: Subscription = new Subscription();
  private subs5: Subscription = new Subscription();
  private subs6: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

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
   */
  ngOnInit() {
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
   * This function execute on event delete button
   *
   * Detect if user confirm the action and proced to delete this product
   *
   */
  deleteProduct(name: any, id: any) {
    if (
      window.confirm(
        'La eliminación del producto implica:\n- La eliminación de los productos en los albaranes de mercancía\n  (pudiendo quedar un albarán vacío)\n- La eliminación del producto\n\n¿Seguro que desea borrar el producto ' +
          name +
          '?'
      )
    ) {
      //Get all products of backend
      this.subs2 = this.productService.delete(id).subscribe({
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
   * Get all products and send to generate PDF
   *
   */
  productsToPDF() {
    this.isPrintingPDF = true;
    let text = '';
    //Get all products of backend
    this.subs4 = this.productService.getAllNoPaginated().subscribe({
      next: result => {
        let products = JSON.parse(JSON.stringify(result));
        if (this.isFilter) {
          const filterBox = document.getElementById('filterSearch') as HTMLInputElement;
          text = StringUtils.removeSpacesAccentsAndUpperCase(filterBox?.value)!;
          products = this.filterProducts(products, text);
        }
        products.sort((a: { id: number }, b: { id: number }) => a.id - b.id);
        this.generatePDF(products, text);
        this.isPrintingPDF = false;
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
  generatePDF(products: any, filter: string) {
    let doc = new jsPDF({ putOnlyUsedFonts: true, orientation: 'landscape' });

    let pages = doc.getNumberOfPages();
    let pageWidth = doc.internal.pageSize.width; //Optional
    let pageHeight = doc.internal.pageSize.height; //Optional

    //Parser of table's columns name
    let columns: ColumnInput[] = [
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
        key: 'supplierName',
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
      headStyles: { fillColor: [253, 199, 60], textColor: 'black', halign: 'center' },
      willDrawCell: function (data) {
        if (data.column.index === 3 && data.section === 'body') {
          let price = +data.cell.text[0];
          data.cell.text[0] = price.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
          });
          data.cell.styles.halign = 'right';
        }
        if (data.column.index === 4) data.cell.styles.halign = 'right';
      },
    });

    pages = doc.getNumberOfPages();

    //Footer with page number
    for (let j = 1; j < pages + 1; j++) {
      let horizontalPos = pageWidth / 2; //Can be fixed number
      let verticalPos = pageHeight - 5; //Can be fixed number
      doc.setFontSize(10);
      this.isFilter
        ? doc.text('Informe de productos filtrado por ' + filter, pageWidth / 2, 15, {
            align: 'center',
          })
        : doc.text('Informe de todos los productos', pageWidth / 2, 15, { align: 'center' });
      doc.addImage('../../assets/img/icons/gesmerca.png', 'PNG', 275, 5, 15, 15);

      doc.setPage(j);
      doc.text(new Date().toLocaleString(), pageWidth - 47, verticalPos, { align: 'left' });
      doc.text(`${j} de ${pages}`, horizontalPos, verticalPos, { align: 'center' });
    }

    doc.save(
      'listado_productos_' +
        new Date().toLocaleDateString('es-ES') +
        '-' +
        new Date().toLocaleTimeString('es-ES') +
        '.pdf'
    );
  }

  /**
   * Get a text and search on server
   *
   */
  search() {
    const btn = document.getElementById('search-report')!.getElementsByTagName('button')[0];
    const filterBox = document.getElementById('filterSearch') as HTMLInputElement;
    const text = StringUtils.removeSpacesAccentsAndUpperCase(filterBox.value);
    if (btn.textContent != 'Quitar filtro') {
      if (text != '') {
        this.isSearching = true;
        this.isFilter = true;
        //Get all products of backend
        this.subs5 = this.productService.getAllNoPaginated().subscribe({
          next: result => {
            let products = JSON.parse(JSON.stringify(result)) as Product[];
            this._products = this.filterProducts(products, text);
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
      this.subs6 = this.productService
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

  filterProducts(products: Product[], text: string) {
    return products.filter(
      (e: Product) =>
        StringUtils.removeSpacesAccentsAndUpperCase(e.name!).includes(text) ||
        StringUtils.removeSpacesAccentsAndUpperCase(e.description!).includes(text) ||
        StringUtils.removeSpacesAccentsAndUpperCase(e.supplierName!).includes(text) ||
        e.price == Number(text.replace(',', '.')) ||
        e.stock == Number(text)
    );
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
    this.subs6.unsubscribe();
  }

  get products() {
    return this._products;
  }

  get links() {
    return this._links;
  }
}
