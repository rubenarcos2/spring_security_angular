import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class SupplierAddComponent implements OnInit, OnDestroy {
  protected supplierForm!: FormGroup;
  dataForm!: FormData;
  returnUrl!: string;
  isFormUpdating: boolean = false;
  private subs: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  /**
   * This function start on event page
   *
   */
  ngOnInit(): void {
    this.supplierForm = this.formBuilder.group({
      cifNif: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      web: [''],
      notes: [''],
    });
  }

  /**
   * This function execute on form submit
   *
   * Send form data to backend and create a new supplier
   *
   */
  onSubmit() {
    this.dataForm = new FormData();
    this.dataForm.append('cifNif', this.supplierForm.get('cifNif')?.value);
    this.dataForm.append('name', this.supplierForm.get('name')?.value);
    this.dataForm.append('address', this.supplierForm.get('address')?.value);
    this.dataForm.append('city', this.supplierForm.get('city')?.value);
    this.dataForm.append('phone', this.supplierForm.get('phone')?.value);
    this.dataForm.append('email', this.supplierForm.get('email')?.value);
    this.dataForm.append('web', this.supplierForm.get('web')?.value);
    this.dataForm.append('notes', this.supplierForm.get('notes')?.value);

    //Send a new supplier to backend
    this.subs = this.supplierService.create(this.dataForm).subscribe({
      next: result => {
        let res = JSON.parse(JSON.stringify(result));
        this.isFormUpdating = false;
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
   * Detect if input value is changed and set isFormUpdating value on true change
   *
   * @param  {Event} event The event change input
   */
  onChangeInput(event: any) {
    let input = event.target.id;
    switch (input) {
      case 'inputCifNif':
        this.isFormUpdating = event.target.value != '';
        break;
      case 'inputName':
        this.isFormUpdating = event.target.value != '';
        break;
      case 'inputAddress':
        this.isFormUpdating = event.target.value != '';
        break;
      case 'inputCity':
        this.isFormUpdating = event.target.value != '';
        break;
      case 'inputPhone':
        this.isFormUpdating = event.target.value != '';
        break;
      case 'inputEmail':
        this.isFormUpdating = event.target.value != '';
        break;
      case 'inputWeb':
        this.isFormUpdating = event.target.value != '';
        break;
      case 'inputNotes':
        this.isFormUpdating = event.target.value != '';
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
  }

  get supplierFormControls() {
    return this.supplierForm.controls;
  }
}
