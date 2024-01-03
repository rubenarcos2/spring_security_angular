import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, first } from 'rxjs';
import { Supplier } from 'src/app/models/supplier';
import { SupplierService } from 'src/app/services/supplier.service';
import jsPDF, { CellConfig } from 'jspdf';
import autoTable, { ColumnInput } from 'jspdf-autotable';
import StringUtils from 'src/app/utils/stringsUtils';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class SupplierListComponent implements OnInit, OnDestroy {
  private _suppliers?: Supplier[];
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
    private supplierService: SupplierService,
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
    //Get all suppliers of backend
    this.subs = this.supplierService
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
          this._suppliers = res._embedded.supplierModelList;
        },
        error: error => {
          this.toastr.error(error ? error : 'No se puede conectar con el servidor');
        },
      });
  }

  /**
   * This function execute on event delete button
   *
   * Detect if user confirm the action and proced to delete this supplier
   *
   */
  deleteSupplier(name: any, id: any) {
    if (
      window.confirm(
        'El borrado del proveedor implica:\n- La eliminación de todos los productos de este proveedor\n- La eliminación de todos los albaranes de este proveedor\n- La eliminación del proveedor\n\n¿Seguro que desea eliminar el proveedor ' +
          name +
          '?'
      )
    ) {
      const supplier = this.suppliers!.find(x => x.id === id);

      //Remove this suplier of backend
      this.subs2 = this.supplierService.delete(supplier, id).subscribe({
        next: result => {
          this._suppliers = this.suppliers!.filter(x => x.id !== id);
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
   * Get a group of suppliers of paginate selected
   */
  onChangePagination(event: any): void {
    event.preventDefault();
    this.subs3 = this.supplierService
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
          this._suppliers = res._embedded.supplierModelList;
        },
        error: error => {
          this.toastr.error(error ? error : 'No se puede conectar con el servidor');
        },
      });
  }

  /**
   * Get all suppliers and send to generate PDF
   *
   */
  suppliersToPDF() {
    this.isPrintingPDF = true;
    let text = '';
    //Get all suppliers of backend
    this.subs4 = this.supplierService.getAllNoPaginated().subscribe({
      next: result => {
        let suppliers = JSON.parse(JSON.stringify(result));
        if (this.isFilter) {
          const filterBox = document.getElementById('filterSearch') as HTMLInputElement;
          text = StringUtils.removeSpacesAccentsAndUpperCase(filterBox.value);

          let filterEstrict = (document.getElementById('chkFilterSearch') as HTMLInputElement)
            .checked;
          suppliers = this.filterSuppliers(suppliers, text, filterEstrict);
        }
        suppliers.sort((a: { id: number }, b: { id: number }) => a.id - b.id);
        suppliers.forEach((sup: { id: string; created_at: any; updated_at: any; image: any }) => {
          sup.id = String(sup.id);
          delete sup.created_at;
          delete sup.updated_at;
          delete sup.image;
        });
        this.generatePDF(suppliers, text);
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
  generatePDF(suppliers: any, filter: string) {
    let doc = new jsPDF({ putOnlyUsedFonts: true, orientation: 'landscape' });

    let pages = doc.getNumberOfPages();
    let pageWidth = doc.internal.pageSize.width; //Optional
    let pageHeight = doc.internal.pageSize.height; //Optional

    let columns: ColumnInput[] = [
      {
        title: 'CIF/NIF',
        key: 'cifNif',
      },
      {
        title: 'Nombre',
        key: 'name',
      },
      {
        title: 'Dirección',
        key: 'address',
      },
      {
        title: 'Ciudad',
        key: 'city',
      },
      {
        title: 'Teléf.',
        key: 'phone',
      },
      {
        title: 'Email',
        key: 'email',
      },
      {
        title: 'Pág. web',
        key: 'web',
      },
      {
        title: 'Comentarios',
        key: 'notes',
      },
    ];
    autoTable(doc, {
      columns: columns,
      body: suppliers,
      margin: { top: 25 },
      headStyles: { fillColor: [253, 199, 60], textColor: 'black' },
    });

    pages = doc.getNumberOfPages();

    //Footer with page number
    for (let j = 1; j < pages + 1; j++) {
      let horizontalPos = pageWidth / 2; //Can be fixed number
      let verticalPos = pageHeight - 5; //Can be fixed number
      doc.setFontSize(10);
      this.isFilter
        ? doc.text('Informe de proveedores filtrado por ' + filter, pageWidth / 2, 15, {
            align: 'center',
          })
        : doc.text('Informe de todos los proveedores', pageWidth / 2, 15, { align: 'center' });
      doc.addImage('../../assets/img/icons/gesmerca.png', 'PNG', 275, 5, 15, 15);

      doc.setPage(j);
      doc.text(new Date().toLocaleString(), pageWidth - 47, verticalPos, { align: 'left' });
      doc.text(`${j} de ${pages}`, horizontalPos, verticalPos, { align: 'center' });
    }

    doc.save(
      'listado_proveedores_' +
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
        this.subs5 = this.supplierService.getAllNoPaginated().subscribe({
          next: result => {
            let suppliers = JSON.parse(JSON.stringify(result)) as Supplier[];
            let filterEstrict = (document.getElementById('chkFilterSearch') as HTMLInputElement)
              .checked;
            this._suppliers = this.filterSuppliers(suppliers, text, filterEstrict);
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
      //Get all suppliers of backend
      this.subs6 = this.supplierService
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
            this._suppliers = res._embedded.supplierModelList;
            btn.setAttribute('class', 'btn-secondary btn-sm mb-2');
            btn.textContent = 'Filtrar';
            btn.value = '';
            filterBox.value = '';
            this.isSearching = false;
            (document.getElementById('chkFilterSearch') as HTMLInputElement).checked = false;
          },
          error: error => {
            this.toastr.error(error ? error : 'No se puede conectar con el servidor');
          },
        });
    }
  }

  /**
   * This function realise a filtered of suppliers
   *
   */
  filterSuppliers(
    suppliers: Supplier[],
    text: string,
    isFilterEstrictByCifNif: boolean
  ): Supplier[] {
    if (!isFilterEstrictByCifNif)
      return suppliers.filter(
        (e: Supplier) =>
          StringUtils.removeSpacesAccentsAndUpperCase(e.cifNif!).includes(text) ||
          StringUtils.removeSpacesAccentsAndUpperCase(e.name!).includes(text) ||
          StringUtils.removeSpacesAccentsAndUpperCase(e.phone!).includes(text)
      );
    else
      return suppliers.filter(
        (e: Supplier) => StringUtils.removeSpacesAccentsAndUpperCase(e.cifNif!) === text
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

  get suppliers() {
    return this._suppliers;
  }

  get links() {
    return this._links;
  }
}
