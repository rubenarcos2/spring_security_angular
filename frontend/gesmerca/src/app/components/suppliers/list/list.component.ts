import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, first } from 'rxjs';
import { Supplier } from 'src/app/models/supplier';
import { SupplierService } from 'src/app/services/supplier.service';
import jsPDF, { CellConfig } from 'jspdf';
import autoTable, { ColumnInput } from 'jspdf-autotable';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class SupplierListComponent implements OnInit, OnDestroy {
  private _suppliers?: Supplier[];
  private _links?: any[];
  protected isPrintingPDF = false;
  protected isSearching = false;
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();
  private subs3: Subscription = new Subscription();

  constructor(
    private supplierService: SupplierService,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

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
          this._links = res.links;
          this._suppliers = res.data;
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
    if (window.confirm('¿Seguro que desea borrar el proveedor ' + name + '?')) {
      const supplier = this.suppliers!.find(x => x.id === id);

      //Remove this suplier of backend
      this.supplierService.delete(supplier, id).subscribe({
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
    this.subs2 = this.supplierService
      .getAll(event.target.href.split('?')[1])
      .pipe(first())
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          this._links = res.links;
          this._suppliers = res.data;
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

    //Get all suppliers of backend
    this.subs3 = this.supplierService.getAllNoPaginated().subscribe({
      next: result => {
        let suppliers = JSON.parse(JSON.stringify(result));
        suppliers.sort((a: { id: number }, b: { id: number }) => a.id - b.id);
        suppliers.forEach((sup: { id: string; created_at: any; updated_at: any; image: any }) => {
          sup.id = String(sup.id);
          delete sup.created_at;
          delete sup.updated_at;
          delete sup.image;
        });
        console.log(suppliers);
        this.generatePDF(suppliers);
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
  generatePDF(suppliers: any) {
    let doc = new jsPDF({ putOnlyUsedFonts: true, orientation: 'landscape' });

    let pages = doc.getNumberOfPages();
    let pageWidth = doc.internal.pageSize.width; //Optional
    let pageHeight = doc.internal.pageSize.height; //Optional

    let columns: ColumnInput[] = [
      {
        title: 'Código',
        key: 'id',
      },
      {
        title: 'CIF/NIF',
        key: 'cif_nif',
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
      doc.text('Informe de todos los proveedores', pageWidth / 2, 15, { align: 'center' });
      doc.addImage('../../assets/img/icons/gesmerca.png', 'PNG', 275, 5, 15, 15);

      doc.setPage(j);
      doc.text(`${j} de ${pages}`, horizontalPos, verticalPos, { align: 'center' });
    }

    doc.save('listado_proveedores.pdf');
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
        this.subs = this.supplierService.getAllNoPaginated().subscribe({
          next: result => {
            let res = JSON.parse(JSON.stringify(result)) as Supplier[];
            this._suppliers = res.filter(
              e => e.cif_nif?.includes(text) || e.name?.includes(text) || e.phone?.includes(text)
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
      //Get all suppliers of backend
      this.subs = this.supplierService
        .getAll()
        .pipe(first())
        .subscribe({
          next: result => {
            let res = JSON.parse(JSON.stringify(result));
            this._links = res.links;
            this._suppliers = res.data;
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
  }

  get suppliers() {
    return this._suppliers;
  }

  get links() {
    return this._links;
  }
}
