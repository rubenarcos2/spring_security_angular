import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Supplier } from 'src/app/models/supplier';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class ProductAddComponent implements OnInit, OnDestroy {
  protected productForm!: FormGroup;
  dataForm!: FormData;
  returnUrl!: string;
  isFormUpdating: boolean = false;
  private _suppliers?: Supplier[];

  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();
  private subs3: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private supplierService: SupplierService,
    protected authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * This function start on event page
   *
   */
  ngOnInit(): void {
    let idSupplier;
    this.subs = this.route.queryParams.subscribe(param => (idSupplier = parseInt(param['prov'])));

    this.dataForm = new FormData();
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      supplier: [null, Validators.required],
      image: [null, Validators.pattern(/[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)],
      price: ['', [Validators.required, Validators.pattern(/^(\d+)(,\d{1,2}|\.\d{1,2})?$/)]],
      stock: [0, [Validators.required, Validators.pattern(/^\d+$/)]],
    });

    if (idSupplier) {
      this.productForm.get('supplier')?.setValue(idSupplier);
      this.productForm.get('supplier')?.disable();
    }

    //Get all suppliers of backend
    this.subs2 = this.supplierService.getAllNoPaginated().subscribe({
      next: result => {
        let res = JSON.parse(JSON.stringify(result));
        this._suppliers = res;
      },
      error: error => {
        this.toastr.error(error ? error : 'Operación no autorizada');
      },
    });
  }

  /**
   * This function execute on form submit
   *
   * Send form data to backend and create a new product
   *
   */
  onSubmit() {
    this.dataForm.append('name', this.productForm.get('name')?.value);
    this.dataForm.append('description', this.productForm.get('description')?.value);
    this.dataForm.append('supplier', this.productForm.get('supplier')?.value);
    this.dataForm.append(
      'price',
      this.productForm.get('price')?.value.toString().replace(/,/g, '.')
    );
    this.dataForm.append('stock', this.productForm.get('stock')?.value);

    //Send a new product to create of backend
    this.subs3 = this.productService.create(this.dataForm).subscribe({
      next: result => {
        let res = JSON.parse(JSON.stringify(result));
        this.isFormUpdating = false;
        this.router.navigate([this.returnUrl || '/productos']);
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
      case 'inputName':
        this.isFormUpdating = event.target.value != '';
        break;
      case 'inputDescription':
        this.isFormUpdating = event.target.value != '';
        break;
      case 'select-supplier':
        this.isFormUpdating = event.target.value != '';
        break;
      case 'inputPrice':
        this.isFormUpdating = event.target.value != '';
        break;
      case 'inputStock':
        this.isFormUpdating = event.target.value != '' && event.target.value != '0';
        break;
    }
  }

  /**
   * On event input file append a new image
   *
   * @param  {any} file The input file
   */
  onChangeFile(file: any) {
    if (file.target.files[0] !== undefined) {
      this.dataForm.append('image', file.target.files[0], file.name);
    }
    this.isFormUpdating = file.target.files[0] !== undefined;
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
  }

  get productFormControls() {
    return this.productForm.controls;
  }

  get suppliers() {
    return this._suppliers;
  }
}
