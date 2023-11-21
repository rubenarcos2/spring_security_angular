import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigGeneralEditComponent } from './edit.component';

describe('ConfigGeneralEditComponent', () => {
  let component: ConfigGeneralEditComponent;
  let fixture: ComponentFixture<ConfigGeneralEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
        }),
      ],
      declarations: [ConfigGeneralEditComponent],
      providers: [HttpClient, HttpHandler],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigGeneralEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
