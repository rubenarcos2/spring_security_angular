import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Supplier } from 'src/app/models/supplier';
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
  isSubmitted: boolean = false;
  private _supplier?: Supplier;
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
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
    this.route.params.subscribe(param => (id = parseInt(param['id'])));

    //Get all suppliers of backend
    this.subs = this.supplierService.getById(id).subscribe({
      next: result => {
        this._supplier = result;
        this.supplierForm = this.formBuilder.group({
          id: [this.supplier?.id],
          cif_nif: [this.supplier?.cif_nif, Validators.required],
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
  }

  /**
   * This function execute on form submit
   *
   * Send form data to backend and modify a supplier
   *
   */
  onSubmit() {
    this.isSubmitted = true;
    this.dataForm.append('id', this.supplierForm.get('id')?.value);
    this.dataForm.append('cif_nif', this.supplierForm.get('cif_nif')?.value);
    this.dataForm.append('name', this.supplierForm.get('name')?.value);
    this.dataForm.append('address', this.supplierForm.get('address')?.value);
    this.dataForm.append('city', this.supplierForm.get('city')?.value);
    this.dataForm.append('phone', this.supplierForm.get('phone')?.value);
    this.dataForm.append('email', this.supplierForm.get('email')?.value);
    this.dataForm.append('web', this.supplierForm.get('web')?.value);
    this.dataForm.append('notes', this.supplierForm.get('notes')?.value);

    //Update supplier's data to backend
    this.subs2 = this.supplierService
      .update(this.dataForm, this.supplierForm.get('id')?.value)
      .subscribe({
        next: result => {
          let res = JSON.parse(JSON.stringify(result));
          res.error ? this.toastr.error(res.error) : this.toastr.success(res.message);

          //On successful operation redirect to supplier's page
          this.router.navigate([this.returnUrl || '/proveedores']);
        },
        error: error => {
          this.toastr.error(error.error ? error.error : 'No se puede conectar con el servidor');
        },
      });
    this.subs2.add(() => {
      this.isSubmitted = false;
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
    this.isSubmitted = true;
    switch (input) {
      case 'inputCifNif':
        this.isSubmitted = this.supplierForm.get(input)?.value !== this.supplier?.cif_nif;
        break;
      case 'inputName':
        this.isSubmitted = this.supplierForm.get(input)?.value !== this.supplier?.name;
        break;
      case 'inputAddress':
        this.isSubmitted = this.supplierForm.get(input)?.value !== this.supplier?.address;
        break;
      case 'inputCity':
        this.isSubmitted = this.supplierForm.get(input)?.value !== this.supplier?.city;
        break;
      case 'inputPhone':
        this.isSubmitted = this.supplierForm.get(input)?.value !== this.supplier?.phone;
        break;
      case 'inputEmail':
        this.isSubmitted = this.supplierForm.get(input)?.value !== this.supplier?.email;
        break;
      case 'inputWeb':
        this.isSubmitted = this.supplierForm.get(input)?.value !== this.supplier?.web;
        break;
      case 'inputNotes':
        this.isSubmitted = this.supplierForm.get(input)?.value !== this.supplier?.notes;
        break;
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

  get supplierFormControls() {
    return this.supplierForm.controls;
  }

  get supplier() {
    return this._supplier;
  }
}
