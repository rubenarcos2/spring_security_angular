import { DatePipe } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, delay } from 'rxjs';
import { GoodsReceipt } from 'src/app/models/goodsreceipt';
import { GoodsReceiptProduct } from 'src/app/models/goodsreceiptproduct';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { GoodsreceiptService } from 'src/app/services/goodsreceipt.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class GoodsReceiptEditComponent implements OnInit, OnDestroy {
  goodsReceiptForm!: FormGroup;
  goodsReceiptProductForm!: FormGroup;
  dataForm!: FormData;
  dataProductForm!: FormData;
  isFormUpdating: boolean = false;
  isLoaded: boolean = false;
  today = new Date().toJSON().split('T')[0];
  indexSelectedSupplier: string = '';

  private _products?: Product[];
  private _goodsReceipt?: GoodsReceipt;
  private _goodsReceiptProducts?: GoodsReceiptProduct[];
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();
  private subs3: Subscription = new Subscription();
  private subs4: Subscription = new Subscription();
  private subs5: Subscription = new Subscription();
  private subs6: Subscription = new Subscription();
  private subs7: Subscription = new Subscription();
  private subs8: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private goodsReceiptService: GoodsreceiptService,
    private productService: ProductService,
    protected authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  /**
   * This function start on event page
   *
   */
  ngOnInit(): void {
    //Get url's parameter
    this.subs = this.route.queryParams.subscribe(
      param => (this.isFormUpdating = param['op'] === 'true')
    );
    let id: number = 0;
    this.subs2 = this.route.params.subscribe(param => (id = parseInt(param['id'])));

    this.dataForm = new FormData();
    this.dataProductForm = new FormData();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';

    //Get a goods receipt by the id received by url's param
    this.subs3 = this.goodsReceiptService.getById(id).subscribe({
      next: result => {
        this._goodsReceipt = result as GoodsReceipt;
        console.log(this.goodsReceipt);
        this.indexSelectedSupplier = this.goodsReceipt?.idSupplier?.toString()!;
        this.goodsReceiptForm = this.formBuilder.group({
          id: [this.goodsReceipt?.id],
          docnum: [this.goodsReceipt?.docnum, Validators.required],
          idsupplier: [this.goodsReceipt?.idSupplier, Validators.required],
          suppliername: [this.goodsReceipt?.supplierName],
          iduser: [this.goodsReceipt?.idUser, Validators.required],
          username: [this.goodsReceipt?.userName],
          date: [this.goodsReceipt?.date, [this.dateValidator, Validators.required]],
          time: [
            this.goodsReceipt?.time,
            [
              Validators.required,
              Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/),
            ],
          ],
        });

        this.goodsReceiptProductForm = this.formBuilder.group({
          idgoodsreceipt: [this.goodsReceipt?.id],
          idproduct: [null, Validators.required],
          quantity: [null, Validators.required],
          price: [null, Validators.required],
        });
        //Get all products of this goods receipt of backend
        this.subs4 = this.goodsReceiptService.getProducts(id).subscribe({
          next: result => {
            let res = JSON.parse(JSON.stringify(result));
            console.log(res);
            this._goodsReceiptProducts = res;
            //Get all products of backend
            this.subs5 = this.productService.getAllNoPaginated().subscribe({
              next: result => {
                let prod: Product[];
                let res = JSON.parse(JSON.stringify(result));
                prod = res;
                //Filter only supplier's products
                prod = prod?.filter(e => e.supplier == this.goodsReceipt?.idSupplier);
                //Filter only products not included on goods receipt
                this.goodsReceiptProducts?.forEach(grp => {
                  prod = prod?.filter(e => e.id !== grp.idProduct);
                });
                if (prod.length > 0) {
                  this._products = prod;
                }
                this.isLoaded = true;
              },
              error: error => {
                this.toastr.error(error ? error : 'Operación no autorizada');
              },
            });
          },
          error: error => {
            this.toastr.error(error ? error : 'Operación no autorizada');
          },
        });
      },
      error: error => {
        this.toastr.error(error ? error : 'Operación no autorizada');
      },
    });
  }

  /**
   * This function execute on form submit
   *
   * Send form data to backend and modify all data of the new goods receipt with all your products
   *
   */
  onSubmit(): void {
    this.dataForm.append('id', this.goodsReceiptForm.get('id')?.value);
    this.dataForm.append('docnum', this.goodsReceiptForm.get('docnum')?.value);
    this.dataForm.append('idSupplier', this.goodsReceiptForm.get('idsupplier')?.value);
    this.dataForm.append('idUser', this.goodsReceiptForm.get('iduser')?.value);
    this.dataForm.append('date', this.changeFormatDate(this.goodsReceiptForm.get('date')?.value));
    this.dataForm.append('time', this.goodsReceiptForm.get('time')?.value);

    //Update the goods receipt's data
    this.subs5 = this.goodsReceiptService
      .update(this.dataForm, this.goodsReceiptForm.get('id')?.value)
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          this.isFormUpdating = false;
          this.router.navigate(['/recepcion']);
          this.toastr.success(res.message);
        },
        error: error => {
          this.toastr.error(error ? error : 'No se puede conectar con el servidor');
        },
      });
  }

  /**
   * This function execute on product form submit
   *
   * Send form data to backend and add a product to this goods receipt
   *
   */
  onSubmitProduct(): void {
    this.dataProductForm.append(
      'idGoodsReceipt',
      this.goodsReceiptProductForm.get('idgoodsreceipt')?.value
    );
    this.dataProductForm.append(
      'idProduct',
      (document.getElementById('select-product') as HTMLSelectElement).value
    );
    this.dataProductForm.append('quantity', this.goodsReceiptProductForm.get('quantity')?.value);
    this.dataProductForm.append(
      'price',
      String(this.goodsReceiptProductForm.get('price')?.value).replace(/,/g, '.')
    );

    //Add a product to this goods receipt
    this.subs6 = this.goodsReceiptService
      .addProduct(this.dataProductForm, this.goodsReceipt?.id)
      .subscribe({
        next: res => {
          this.router.navigate([`/recepcion/editar/${this.goodsReceipt?.id}`], {
            queryParams: { op: 'true' },
          });
          this.toastr.success(res.message);
        },
        error: error => {
          this.toastr.error(error ? error : 'No se puede conectar con el servidor');
        },
      });
  }

  /**
   * This function execute on change event input
   *
   * Detect if input value is changed and set isFormUpdating value on true change
   *
   */
  onChangeInput(event: any) {
    let input = event.target.id;
    switch (input) {
      case 'inputDocNum':
        this.isFormUpdating = event.target.value != this.goodsReceipt?.docnum;
        break;
      case 'inputDate':
        this.isFormUpdating = event.target.value != this.goodsReceipt?.date;
        break;
      case 'inputTime':
        this.isFormUpdating = event.target.value != this.goodsReceipt?.time;
        break;
    }
  }

  /**
   * This function execute on change event product input
   *
   * Detect if event is fire and get the estimated price of AI
   *
   */
  onChangeInputProduct() {
    let cmbProd = document.getElementById('select-product') as HTMLSelectElement;
    let priceEst = document.getElementById('priceEst') as HTMLLabelElement;

    if (priceEst && cmbProd.value) {
      let form: FormData = new FormData();
      form.append(
        'idProduct',
        (document.getElementById('select-product') as HTMLSelectElement).value
      );
      form.append('quantity', this.goodsReceiptProductForm.get('quantity')?.value);

      //Get estimated price of backend that is calculated by AI
      this.subs7 = this.goodsReceiptService.getPriceEst(form).subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          priceEst.textContent = res.price + '€';
        },
        error: error => {
          this.toastr.error(error ? error : 'Operación no autorizada');
        },
      });
    }
  }

  /**
   * This function execute on change event date input
   *
   * Detect if the date is upper to now day
   *
   */
  dateValidator(control: FormControl): { [key: string]: any } | null {
    if (control.value) {
      let date = control.value;
      let today = new Date().toJSON().split('T')[0];

      if (new Date(date) > new Date(today)) {
        return { invalidDate: true };
      }
    }
    return null;
  }

  changeFormatDate(date: string): any {
    let d = new Date(date);
    return this.datePipe.transform(d, 'yyyy/MM/dd');
  }

  /**
   * This function execute on event delete button
   *
   * Detect if user confirm the action and proced to delete this product
   *
   */
  deleteProduct(name: any, id: any): void {
    if (this.goodsReceiptProducts?.length! <= 1) {
      window.alert('Al eliminar este producto el albarán quedaría vacío');
    } else {
      if (
        window.confirm(
          'La eliminación del producto implica:\n- La reducción del stock del producto en el almacén\n- La eliminación del producto del albarán\n\n¿Seguro que desea eliminar del albarán el producto ' +
            name +
            '?'
        )
      ) {
        let dataDeleteProdForm = new FormData();
        dataDeleteProdForm.append(
          'idGoodsReceiptProduct',
          String(this.goodsReceiptProducts?.find(e => e.id == id)?.idProduct)
        );
        dataDeleteProdForm.append(
          'quantity',
          String(this.goodsReceiptProducts?.find(e => e.id == id)?.quantity)
        );

        //Delete this product of this goods receipt
        this.subs8 = this.goodsReceiptService
          .deleteProduct(dataDeleteProdForm, this.goodsReceipt?.id)
          .subscribe({
            next: res => {
              this.router.navigate([`/recepcion/editar/${this.goodsReceipt?.id}`], {
                queryParams: { op: 'true' },
              });
              this.toastr.success(res.message);
            },
            error: error => {
              this.toastr.error(error ? error : 'Operación no autorizada');
            },
          });
      }
    }
  }

  /**
   * This function start on refresh or close window/tab navigator
   *
   * Detect if there are changes without save
   *
   * More info about behaviour: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
   */
  @HostListener('window:beforeunload', ['$event'])
  handleClose(e: BeforeUnloadEvent): void {
    //e.preventDefault();
    if (this.isFormUpdating) e.returnValue = true;
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
  }

  get goodsReceiptFormControls() {
    return this.goodsReceiptForm.controls;
  }

  get goodsReceiptProductFormControls() {
    return this.goodsReceiptProductForm.controls;
  }

  get goodsReceipt() {
    return this._goodsReceipt;
  }

  get goodsReceiptProducts() {
    return this._goodsReceiptProducts;
  }

  get products() {
    return this._products;
  }
}
