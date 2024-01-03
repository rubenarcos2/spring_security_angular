import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Config } from 'src/app/models/config';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class ConfigGeneralEditComponent implements OnInit, OnDestroy {
  configForm!: FormGroup;
  dataForm!: FormData;
  returnUrl!: string;
  isFormUpdating: boolean = false;
  private _config?: Config;
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();
  private subs3: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * This function start on event page
   *
   * Get a config of the backend with id received by url's parameter
   *
   */
  ngOnInit(): void {
    let id;
    this.dataForm = new FormData();
    this.subs = this.route.params.subscribe(param => (id = parseInt(param['id'])));

    //Get a config of backend by id
    this.subs2 = this.configService.getById(id).subscribe({
      next: result => {
        this._config = result;
        this.configForm = this.formBuilder.group({
          name: [this.config?.name, [Validators.required, Validators.minLength(3)]],
          title: [this.config?.title, [Validators.required, Validators.minLength(3)]],
          description: [this.config?.description, [Validators.required, Validators.minLength(3)]],
          domain: [this.config?.domain, Validators.required],
          value: [this.config?.value === 'true' ? true : false, Validators.required],
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
   * Send form data to backend and modify this config
   *
   */
  onSubmit() {
    this.dataForm.append('name', this.configForm.get('name')?.value);
    this.dataForm.append('title', this.configForm.get('title')?.value);
    this.dataForm.append('description', this.configForm.get('description')?.value);
    this.dataForm.append('domain', this.configForm.get('domain')?.value);
    this.dataForm.append('value', this.configForm.get('value')?.value);

    //Update a config to backend with form data
    this.subs3 = this.configService.update(this.dataForm).subscribe({
      next: result => {
        let res = JSON.parse(JSON.stringify(result));
        this.isFormUpdating = false;
        this.toastr.success(res.message);
        this.router.navigate([this.returnUrl || '/config/general']);
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
   */
  onChangeInput(event: any) {
    let input = event.target.id;
    switch (input) {
      case 'inputDescription':
        this.isFormUpdating = event.target.value != this.config?.description;
        break;
      case 'inputTitle':
        this.isFormUpdating = event.target.value != this.config?.title;
        break;
      case 'inputValue':
        this.isFormUpdating = event.target.checked != (this.config?.value == 'true') ? true : false;
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
    this.subs2.unsubscribe();
    this.subs3.unsubscribe();
  }

  get configFormControls() {
    return this.configForm.controls;
  }

  get config() {
    return this._config;
  }
}
