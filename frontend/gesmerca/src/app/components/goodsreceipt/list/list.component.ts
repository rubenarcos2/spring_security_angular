import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, first } from 'rxjs';
import { GoodsreceiptService } from 'src/app/services/goodsreceipt.service';
import { GoodsReceipt } from 'src/app/models/goodsreceipt';
import { AuthService } from 'src/app/services/auth.service';
import { DATE_PIPE_DEFAULT_TIMEZONE, DatePipe } from '@angular/common';
import autoTable, { ColumnInput } from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class GoodsReceiptListComponent implements OnInit, OnDestroy {
  private _goodsReceipt?: GoodsReceipt[];
  private _links?: any[];
  protected isPrintingPDF = false;
  protected isSearching = false;
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();
  private subs3: Subscription = new Subscription();
  private subs4: Subscription = new Subscription();
  private subs5: Subscription = new Subscription();
  private subs6: Subscription = new Subscription();
  private subs7: Subscription = new Subscription();
  private subs8: Subscription = new Subscription();
  private subs9: Subscription = new Subscription();

  constructor(
    private goodsReceiptService: GoodsreceiptService,
    private toastr: ToastrService,
    public authService: AuthService,
    private datePipe: DatePipe
  ) {}

  /**
   * This function start on event page
   *
   */
  ngOnInit() {
    //Get all goods receipt
    this.subs = this.goodsReceiptService
      .getAll()
      .pipe(first())
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          this._links = res.links;
          this._goodsReceipt = res.data;
        },
        error: error => {
          this.toastr.error(error ? error : 'No se puede conectar con el servidor');
        },
      });
  }

  /**
   * This function execute on event delete button
   *
   * Detect if user confirm the action and proced to delete this goods receipt
   *
   */
  deleteProduct(name: any, id: any) {
    if (
      window.confirm('¿Seguro que desea borrar el albarán de recepción de mercancía ' + name + '?')
    ) {
      const supplier = this.goodsreceipts!.find(x => x.id === id);
      this.subs5 = this.goodsReceiptService.delete(supplier, id).subscribe({
        next: result => {
          this._goodsReceipt = this.goodsreceipts!.filter(x => x.id !== id);
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
   * Get a group of goods receipt of paginate selected
   */
  onChangePagination(event: any): void {
    event.preventDefault();

    //Get all goods receipt paginated
    this.subs6 = this.goodsReceiptService
      .getAll(event.target.href.split('?')[1])
      .pipe(first())
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          this._links = res.links;
          this._goodsReceipt = res.data;
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
  goodsreceiptToPDF() {
    this.isPrintingPDF = true;

    //Get all goodsReceipt of backend
    this.subs7 = this.goodsReceiptService.getAllNoPaginated().subscribe({
      next: result => {
        let goodsReceipt = JSON.parse(JSON.stringify(result));
        goodsReceipt.sort((a: { date: Date }, b: { date: Date }) => {
          if (a.date < b.date) {
            return 1;
          } else if (a.date > b.date) {
            return -1;
          } else {
            return 0;
          }
        });
        goodsReceipt.forEach((gr: { date: string | number | Date | null }) => {
          gr.date = this.datePipe.transform(gr.date, 'dd/MM/yyyy');
        });
        this.generatePDF(goodsReceipt);
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
  generatePDF(goodsReceipt: any) {
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
        title: 'Núm. doc.',
        key: 'docnum',
      },
      {
        title: 'Proveedor',
        key: 'supplierName',
      },
      {
        title: 'Usuario',
        key: 'userName',
      },
      {
        title: 'Fecha',
        key: 'date',
      },
      {
        title: 'Hora',
        key: 'time',
      },
    ];
    autoTable(doc, {
      columns: columns,
      body: goodsReceipt,
      margin: { top: 25 },
      headStyles: { fillColor: [253, 199, 60], textColor: 'black' },
    });

    pages = doc.getNumberOfPages();

    //Footer with page number
    for (let j = 1; j < pages + 1; j++) {
      let horizontalPos = pageWidth / 2; //Can be fixed number
      let verticalPos = pageHeight - 5; //Can be fixed number
      doc.setFontSize(10);
      doc.text('Informe de todos los albaranes de recepción de mercancía', pageWidth / 2, 15, {
        align: 'center',
      });
      doc.addImage('../../assets/img/icons/gesmerca.png', 'PNG', 275, 5, 15, 15);

      doc.setPage(j);
      doc.text(`${j} de ${pages}`, horizontalPos, verticalPos, { align: 'center' });
    }

    doc.save('listado_albaranes_recepcion_mercancia.pdf');
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
        this.subs = this.goodsReceiptService.getAllNoPaginated().subscribe({
          next: result => {
            let res = JSON.parse(JSON.stringify(result)) as GoodsReceipt[];
            this._goodsReceipt = res.filter(
              e =>
                e.docnum?.includes(text) ||
                e.supplierName?.includes(text) ||
                e.userName?.includes(text)
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
      this.subs = this.goodsReceiptService
        .getAll()
        .pipe(first())
        .subscribe({
          next: result => {
            let res = JSON.parse(JSON.stringify(result));
            this._links = res.links;
            this._goodsReceipt = res.data;
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
    this.subs6.unsubscribe();
    this.subs7.unsubscribe();
    this.subs8.unsubscribe();
    this.subs9.unsubscribe();
  }

  get goodsreceipts() {
    return this._goodsReceipt;
  }

  get links() {
    return this._links;
  }
}
