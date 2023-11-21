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
  isSubmitted: boolean = false;
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
    this.dataForm = new FormData();
    this.supplierForm = this.formBuilder.group({
      cif_nif: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      web: [''],
      notes: [''],
    });
    this.isSubmitted = true;
  }

  /**
   * This function execute on form submit
   *
   * Send form data to backend and create a new supplier
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

    //Send a new supplier to backend
    this.subs = this.supplierService.create(this.dataForm).subscribe({
      next: result => {
        let res = JSON.parse(JSON.stringify(result));
        res.error ? this.toastr.error(res.error) : this.toastr.success(res.message);
        this.router.navigate([this.returnUrl || '/proveedores']);
      },
      error: error => {
        this.toastr.error(error ? error : 'No se puede conectar con el servidor');
      },
    });

    this.subs.add(() => {
      this.isSubmitted = false;
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
    if (this.isSubmitted) e.returnValue = '';
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
