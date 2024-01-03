import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, first } from 'rxjs';
import { Product } from 'src/app/models/product';
import { Supplier } from 'src/app/models/supplier';
import { GoodsReceipt } from 'src/app/models/goodsreceipt';
import { AuthService } from 'src/app/services/auth.service';
import { GoodsreceiptService } from 'src/app/services/goodsreceipt.service';
import { ProductService } from 'src/app/services/product.service';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class SupplierEditComponent implements OnInit, OnDestroy {
  supplierForm!: FormGroup;
  dataForm!: FormData;
  returnUrl!: string;
  isFormUpdating: boolean = false;
  private _supplier?: Supplier;
  private _products?: Product[];
  private _goodsReceipts?: GoodsReceipt[];
  private _linksProducts?: any[];
  private _linksGoodReceipts?: any[];
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();
  private subs3: Subscription = new Subscription();
  private subs4: Subscription = new Subscription();
  private subs5: Subscription = new Subscription();
  private subs6: Subscription = new Subscription();
  private subs7: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private productService: ProductService,
    private goodsreceiptService: GoodsreceiptService,
    public authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * This function start on event page
   *
   */
  ngOnInit(): void {
    let id;
    this.dataForm = new FormData();
    this.subs = this.route.params.subscribe(param => (id = parseInt(param['id'])));

    //Get all suppliers of backend
    this.subs2 = this.supplierService.getById(id).subscribe({
      next: result => {
        this._supplier = result;
        this.supplierForm = this.formBuilder.group({
          id: [this.supplier?.id],
          cifNif: [this.supplier?.cifNif, Validators.required],
          name: [this.supplier?.name, [Validators.required, Validators.minLength(3)]],
          address: [this.supplier?.address, Validators.required],
          city: [this.supplier?.city, Validators.required],
          phone: [this.supplier?.phone, Validators.required],
          email: [this.supplier?.email != 'null' ? this.supplier?.email : ''],
          web: [this.supplier?.web != 'null' ? this.supplier?.web : ''],
          notes: [this.supplier?.notes != null ? this.supplier?.notes : ''],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
      },
      error: error => {
        this.toastr.error(error ? error : 'Operación no autorizada');
      },
    });

    //Get all products by supplier of backend
    this.subs3 = this.productService
      .getAllBySupplier(id)
      .pipe(first())
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          if (res._embedded.productModelList.length > 0) {
            console.log(res);
            this._products = res.data;
            this._linksProducts = [];
            if (res.page.totalPages > 1) {
              if (res._links.first) {
                this._linksProducts.push(res._links.first);
                this._linksProducts[this._linksProducts.length - 1].label = 'Primero';
                this._linksProducts[this._linksProducts.length - 1].href = this._linksProducts[
                  this._linksProducts.length - 1
                ].href.replace('undefined&', '');
              }
              if (res._links.prev) {
                this._linksProducts.push(res._links.prev);
                this._linksProducts[this._linksProducts.length - 1].label = 'Anterior';
                this._linksProducts[this._linksProducts.length - 1].href = this._linksProducts[
                  this._linksProducts.length - 1
                ].href.replace('undefined&', '');
              }
              if (res._links.next) {
                this._linksProducts.push(res._links.next);
                this._linksProducts[this._linksProducts.length - 1].label = 'Siguiente';
                this._linksProducts[this._linksProducts.length - 1].href = this._linksProducts[
                  this._linksProducts.length - 1
                ].href.replace('undefined&', '');
              }
              if (res._links.last) {
                this._linksProducts.push(res._links.last);
                this._linksProducts[this._linksProducts.length - 1].label = 'Último';
                this._linksProducts[this._linksProducts.length - 1].href = this._linksProducts[
                  this._linksProducts.length - 1
                ].href.replace('undefined&', '');
              }
            }
            this._products = res._embedded.productModelList;
          }
        },
        error: error => {
          this.toastr.error(error ? error : 'No se puede conectar con el servidor');
        },
      });

    //Get all goods receipts by supplier of backend
    this.subs4 = this.goodsreceiptService
      .getAllBySupplier(id)
      .pipe(first())
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          if (res._embedded.goodsReceiptModelList.length > 0) {
            this._linksGoodReceipts = [];
            if (res.page.totalPages > 1) {
              if (res._links.first) {
                this._linksGoodReceipts.push(res._links.first);
                this._linksGoodReceipts[this._linksGoodReceipts.length - 1].label = 'Primero';
                this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href =
                  this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href.replace(
                    'undefined&',
                    ''
                  );
              }
              if (res._links.prev) {
                this._linksGoodReceipts.push(res._links.prev);
                this._linksGoodReceipts[this._linksGoodReceipts.length - 1].label = 'Anterior';
                this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href =
                  this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href.replace(
                    'undefined&',
                    ''
                  );
              }
              if (res._links.next) {
                this._linksGoodReceipts.push(res._links.next);
                this._linksGoodReceipts[this._linksGoodReceipts.length - 1].label = 'Siguiente';
                this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href =
                  this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href.replace(
                    'undefined&',
                    ''
                  );
              }
              if (res._links.last) {
                this._linksGoodReceipts.push(res._links.last);
                this._linksGoodReceipts[this._linksGoodReceipts.length - 1].label = 'Último';
                this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href =
                  this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href.replace(
                    'undefined&',
                    ''
                  );
              }
            }
            this._goodsReceipts = res._embedded.goodsReceiptModelList;
            console.log(this.goodsReceipts);
          }
        },
        error: error => {
          this.toastr.error(error ? error : 'No se puede conectar con el servidor');
        },
      });
  }

  /**
   * This function execute on form submit
   *
   * Send form data to backend and modify a supplier
   *
   */
  onSubmit() {
    this.dataForm.append('id', this.supplierForm.get('id')?.value);
    this.dataForm.append('cifNif', this.supplierForm.get('cifNif')?.value);
    this.dataForm.append('name', this.supplierForm.get('name')?.value);
    this.dataForm.append('address', this.supplierForm.get('address')?.value);
    this.dataForm.append('city', this.supplierForm.get('city')?.value);
    this.dataForm.append('phone', this.supplierForm.get('phone')?.value);
    this.dataForm.append('email', this.supplierForm.get('email')?.value);
    this.dataForm.append('web', this.supplierForm.get('web')?.value);
    this.dataForm.append('notes', this.supplierForm.get('notes')?.value);

    //Update supplier's data to backend
    this.subs5 = this.supplierService
      .update(this.dataForm, this.supplierForm.get('id')?.value)
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          this.isFormUpdating = false;
          //On successful operation redirect to supplier's page
          this.router.navigate([this.returnUrl || '/proveedores']);
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
   * Detect if input value is changed and set submited value on true change
   *
   * @param  {Event} event The event change input
   */
  onChangeInput(event: any) {
    let input = event.target.id;
    switch (input) {
      case 'inputCifNif':
        this.isFormUpdating = event.target.value != this.supplier?.cifNif;
        break;
      case 'inputName':
        this.isFormUpdating = event.target.value != this.supplier?.name;
        break;
      case 'inputAddress':
        this.isFormUpdating = event.target.value != this.supplier?.address;
        break;
      case 'inputCity':
        this.isFormUpdating = event.target.value != this.supplier?.city;
        break;
      case 'inputPhone':
        this.isFormUpdating = event.target.value != this.supplier?.phone;
        break;
      case 'inputEmail':
        this.isFormUpdating =
          event.target.value != this.supplier?.email && event.target.value != '';
        break;
      case 'inputWeb':
        this.isFormUpdating = event.target.value != this.supplier?.web && event.target.value != '';
        break;
      case 'inputNotes':
        this.isFormUpdating =
          event.target.value != this.supplier?.notes && event.target.value != '';
        break;
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
  onChangePaginationProducts(event: any): void {
    event.preventDefault();

    //Get all products paginated
    this.subs6 = this.productService
      .getAllBySupplier(this.supplier?.id, event.target.href.split('?')[1])
      .pipe(first())
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          this._linksProducts = [];
          if (res.page.totalPages > 1) {
            if (res._links.first) {
              this._linksProducts.push(res._links.first);
              this._linksProducts[this._linksProducts.length - 1].label = 'Primero';
              this._linksProducts[this._linksProducts.length - 1].href = this._linksProducts[
                this._linksProducts.length - 1
              ].href.replace('undefined&', '');
            }
            if (res._links.prev) {
              this._linksProducts.push(res._links.prev);
              this._linksProducts[this._linksProducts.length - 1].label = 'Anterior';
              this._linksProducts[this._linksProducts.length - 1].href = this._linksProducts[
                this._linksProducts.length - 1
              ].href.replace('undefined&', '');
            }
            if (res._links.next) {
              this._linksProducts.push(res._links.next);
              this._linksProducts[this._linksProducts.length - 1].label = 'Siguiente';
              this._linksProducts[this._linksProducts.length - 1].href = this._linksProducts[
                this._linksProducts.length - 1
              ].href.replace('undefined&', '');
            }
            if (res._links.last) {
              this._linksProducts.push(res._links.last);
              this._linksProducts[this._linksProducts.length - 1].label = 'Último';
              this._linksProducts[this._linksProducts.length - 1].href = this._linksProducts[
                this._linksProducts.length - 1
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
   * Get a group of goods receipt of paginate selected
   */
  onChangePaginationGoodsReceipts(event: any): void {
    event.preventDefault();

    //Get all products paginated
    this.subs7 = this.goodsreceiptService
      .getAllBySupplier(this.supplier?.id, event.target.href.split('?')[1])
      .pipe(first())
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          this._linksGoodReceipts = [];
          if (res.page.totalPages > 1) {
            if (res._links.first) {
              this._linksGoodReceipts.push(res._links.first);
              this._linksGoodReceipts[this._linksGoodReceipts.length - 1].label = 'Primero';
              this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href =
                this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href.replace(
                  'undefined&',
                  ''
                );
            }
            if (res._links.prev) {
              this._linksGoodReceipts.push(res._links.prev);
              this._linksGoodReceipts[this._linksGoodReceipts.length - 1].label = 'Anterior';
              this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href =
                this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href.replace(
                  'undefined&',
                  ''
                );
            }
            if (res._links.next) {
              this._linksGoodReceipts.push(res._links.next);
              this._linksGoodReceipts[this._linksGoodReceipts.length - 1].label = 'Siguiente';
              this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href =
                this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href.replace(
                  'undefined&',
                  ''
                );
            }
            if (res._links.last) {
              this._linksGoodReceipts.push(res._links.last);
              this._linksGoodReceipts[this._linksGoodReceipts.length - 1].label = 'Último';
              this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href =
                this._linksGoodReceipts[this._linksGoodReceipts.length - 1].href.replace(
                  'undefined&',
                  ''
                );
            }
          }
          this._products = res._embedded.goodsReceiptModelList;
        },
        error: error => {
          this.toastr.error(error ? error : 'No se puede conectar con el servidor');
        },
      });
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
  }

  get supplierFormControls() {
    return this.supplierForm.controls;
  }

  get supplier() {
    return this._supplier;
  }

  get products() {
    return this._products;
  }

  get goodsReceipts() {
    return this._goodsReceipts;
  }

  get linksProducts() {
    return this._linksProducts;
  }

  get linksGoodReceipts() {
    return this._linksGoodReceipts;
  }
}
