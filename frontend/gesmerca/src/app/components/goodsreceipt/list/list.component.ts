import { Component, HostListener, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, first } from 'rxjs';
import { GoodsreceiptService } from 'src/app/services/goodsreceipt.service';
import { GoodsReceipt } from 'src/app/models/goodsreceipt';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import autoTable, { ColumnInput } from 'jspdf-autotable';
import jsPDF from 'jspdf';
import StringUtils from 'src/app/utils/stringsUtils';
import { Product } from 'src/app/models/product';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class GoodsReceiptListComponent implements OnInit, OnDestroy {
  private _goodsReceipt?: GoodsReceipt[];
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
    private goodsReceiptService: GoodsreceiptService,
    private toastr: ToastrService,
    public authService: AuthService,
    private datePipe: DatePipe
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
    //Get all goods receipt
    this.subs = this.goodsReceiptService
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
          this._goodsReceipt = res._embedded.goodsReceiptModelList;
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
      window.confirm(
        'La eliminación del albarán implica:\n- La reducción del stock de todos los productos del albarán\n- La eliminación del albarán de mercancía\n\n¿Seguro que desea eliminar el albarán de recepción de mercancía ' +
          name +
          '?'
      )
    ) {
      const supplier = this.goodsreceipts!.find(x => x.id === id);
      this.subs2 = this.goodsReceiptService.delete(supplier, id).subscribe({
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
    this.subs3 = this.goodsReceiptService
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
          this._goodsReceipt = res._embedded.goodsReceiptModelList;
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
    let text = '';
    //Get all goodsReceipt of backend
    this.subs4 = this.goodsReceiptService.getAllNoPaginated().subscribe({
      next: result => {
        let goodsReceipts = JSON.parse(JSON.stringify(result));
        if (this.isFilter) {
          const filterBox = document.getElementById('filterSearch') as HTMLInputElement;
          text = filterBox.value.toLocaleUpperCase().trimStart().trimEnd();
          let filterEstrict = (document.getElementById('chkFilterSearch') as HTMLInputElement)
            .checked;
          goodsReceipts = this.filterGoodsReceipts(goodsReceipts, text, filterEstrict);
        }
        goodsReceipts.sort((a: { date: Date }, b: { date: Date }) => {
          if (a.date < b.date) {
            return 1;
          } else if (a.date > b.date) {
            return -1;
          } else {
            return 0;
          }
        });
        goodsReceipts.forEach((gr: { date: string | number | Date | null }) => {
          gr.date = this.datePipe.transform(gr.date, 'dd/MM/yyyy');
        });
        this.generatePDF(goodsReceipts, text);
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
  generatePDF(goodsReceipt: any, filter: string) {
    let doc = new jsPDF({ putOnlyUsedFonts: true, orientation: 'landscape' });

    let pages = doc.getNumberOfPages();
    let pageWidth = doc.internal.pageSize.width; //Optional
    let pageHeight = doc.internal.pageSize.height; //Optional

    let columns: ColumnInput[] = [
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
      this.isFilter
        ? doc.text(
            'Informe de albaranes de recepción de mercancía filtrado por ' + filter,
            pageWidth / 2,
            15,
            {
              align: 'center',
            }
          )
        : doc.text('Informe de todos los albaranes de recepción de mercancía', pageWidth / 2, 15, {
            align: 'center',
          });
      doc.addImage('../../assets/img/icons/gesmerca.png', 'PNG', 275, 5, 15, 15);

      doc.setPage(j);
      doc.text(new Date().toLocaleString(), pageWidth - 47, verticalPos, { align: 'left' });
      doc.text(`${j} de ${pages}`, horizontalPos, verticalPos, { align: 'center' });
    }

    doc.save(
      'listado_albaranes_recepcion_mercancia_' +
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
        this.subs5 = this.goodsReceiptService.getAllNoPaginated().subscribe({
          next: result => {
            let goodsReceipts = JSON.parse(JSON.stringify(result)) as GoodsReceipt[];
            let filterEstrict = (document.getElementById('chkFilterSearch') as HTMLInputElement)
              .checked;
            this._goodsReceipt = this.filterGoodsReceipts(goodsReceipts, text, filterEstrict);
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
      this.subs6 = this.goodsReceiptService
        .getAll()
        .pipe(first())
        .subscribe({
          next: result => {
            let res = JSON.parse(JSON.stringify(result));
            this._links = res.links;
            this._goodsReceipt = res.data;
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
   * This function realise a filtered of products
   *
   */
  filterGoodsReceipts(
    goodsReceipt: GoodsReceipt[],
    text: string,
    isFilterEstrictByDocNum: boolean
  ): Product[] {
    if (!isFilterEstrictByDocNum)
      return goodsReceipt.filter(
        e =>
          StringUtils.removeSpacesAccentsAndUpperCase(e.docnum!).includes(
            StringUtils.removeSpacesAccentsAndUpperCase(text)
          ) ||
          StringUtils.removeSpacesAccentsAndUpperCase(e.supplierName!).includes(
            StringUtils.removeSpacesAccentsAndUpperCase(text)
          ) ||
          StringUtils.removeSpacesAccentsAndUpperCase(e.userName!).includes(
            StringUtils.removeSpacesAccentsAndUpperCase(text)
          )
      );
    else
      return goodsReceipt.filter(
        (e: GoodsReceipt) =>
          StringUtils.removeSpacesAccentsAndUpperCase(e.docnum!) ===
          StringUtils.removeSpacesAccentsAndUpperCase(text)
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

  get goodsreceipts() {
    return this._goodsReceipt;
  }

  get links() {
    return this._links;
  }
}
