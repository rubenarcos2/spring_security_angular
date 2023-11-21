import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Supplier } from 'src/app/models/supplier';
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
  isSubmitted: boolean = false;
  private _suppliers?: Supplier[];
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private supplierService: SupplierService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  /**
   * This function start on event page
   *
   */
  ngOnInit(): void {
    this.dataForm = new FormData();
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      supplier: ['', Validators.required],
      image: [null],
      price: ['', Validators.required],
      stock: ['', Validators.required],
    });
    this.isSubmitted = true;

    //Get all suppliers of backend
    this.subs = this.supplierService.getAllNoPaginated().subscribe({
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
    this.isSubmitted = true;
    this.dataForm.append('name', this.productForm.get('name')?.value);
    this.dataForm.append('description', this.productForm.get('description')?.value);
    this.dataForm.append('supplier', this.productForm.get('supplier')?.value);
    this.dataForm.append('price', this.productForm.get('price')?.value.replace(/,/g, '.'));
    this.dataForm.append('stock', this.productForm.get('stock')?.value);

    //Send a new product to create of backend
    this.subs2 = this.productService.create(this.dataForm).subscribe({
      next: result => {
        let res = JSON.parse(JSON.stringify(result));
        res.error ? this.toastr.error(res.error) : this.toastr.success(res.message);
        this.router.navigate([this.returnUrl || '/productos']);
      },
      error: error => {
        this.toastr.error(error ? error : 'No se puede conectar con el servidor');
      },
    });
    this.subs2.add(() => {
      this.isSubmitted = false;
    });
  }

  /**
   * On event input file append a new image
   *
   * @param  {any} file The input file
   */
  onChangeFile(file: any) {
    this.dataForm.append('image', file.target.files[0], file.name);
    this.isSubmitted = true;
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
    if (!this.isSubmitted) e.returnValue = '';
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
  }

  get productFormControls() {
    return this.productForm.controls;
  }

  get suppliers() {
    return this._suppliers;
  }
}
