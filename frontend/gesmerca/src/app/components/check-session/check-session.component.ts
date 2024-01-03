import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription, map, take, takeUntil, timer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CheckSessionService } from 'src/app/services/check-session.service';

@Component({
  selector: 'checkSession',
  templateUrl: './check-session.component.html',
  styleUrls: ['./check-session.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckSessionComponent implements OnInit, OnDestroy {
  @Input() id?: string = 'CheckSession';
  isOpen = false;
  private element: any;
  private stopperCountDownTimer = new Subject<boolean>();
  protected countDownTimer: Observable<number> = new Observable();
  private isSessionModal = false;
  protected progresBarPerc: number = 0;
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();

  constructor(
    protected checkSessionService: CheckSessionService,
    protected authService: AuthService,
    protected date: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private el: ElementRef
  ) {
    this.element = el.nativeElement;
  }

  /**
   * This function start on event page
   *
   */
  ngOnInit() {
    // add self (this modal instance) to the modal service so it can be opened from any component
    this.checkSessionService.add(this);

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    this.element.style.display = 'none';
  }

  /**
   * Set visible this component
   *
   */
  open(time?: any) {
    this.element.style.display = 'block';
    document.body.classList.add('checkSession-modal-open');
    this.isOpen = true;
    this.startCountDownTimer(time);
  }

  /**
   * On event click cancel extend session
   *
   */
  cancel() {
    this.subs = this.authService.logout().subscribe({
      error: error => {
        this.toastr.error(
          error ? error : 'No se puede conectar con el servidor para cerrar la sesión'
        );
      },
    });
    this.stopCountDownTimer();

    this.element.style.display = 'none';
    document.body.classList.remove('checkSession-modal-open');
    this.isOpen = false;
    this.router.navigate(['login'], {
      queryParams: { expired: 'true' },
    });
  }

  /**
   * Set hidden this component
   *
   */
  close() {
    if (this.isSessionModal)
      this.subs2 = this.authService.refresh(null).subscribe({
        next: res => {
          this.checkSessionService.startCheckSession();
        },
        error: error => {
          this.toastr.error(error ? error : 'No se puede conectar con el servidor');
        },
      });

    this.stopCountDownTimer();

    this.element.style.display = 'none';
    document.body.classList.remove('checkSession-modal-open');
    this.isOpen = false;
  }

  /**
   * Set a timer to realise a count down on open modal
   *
   */
  startCountDownTimer(timeOnMillisec?: any) {
    this.isSessionModal = timeOnMillisec != undefined;

    this.countDownTimer = timer(0, 1000).pipe(
      take(timeOnMillisec ? timeOnMillisec / 1000 : CheckSessionService.IDLE_USER_COUNT_DOWN),
      map(secondsElapsed =>
        timeOnMillisec
          ? timeOnMillisec - (secondsElapsed + 1) * 1000
          : CheckSessionService.IDLE_USER_COUNT_DOWN * 1000 - (secondsElapsed + 1) * 1000
      ),
      takeUntil(this.stopperCountDownTimer)
    );

    this.countDownTimer.subscribe(timeElapsed => {
      if (timeOnMillisec) this.progresBarPerc = (timeElapsed * 100) / timeOnMillisec;
      else
        this.progresBarPerc = Math.trunc(
          ((timeElapsed / 1000) * 100) / CheckSessionService.IDLE_USER_COUNT_DOWN
        );
      if (Math.trunc(timeElapsed / 1000) <= 0) this.cancel();
    });
  }

  /**
   * Stop a timer count down on close modal
   *
   */
  stopCountDownTimer() {
    this.stopperCountDownTimer.next(true);
  }

  /**
   * This function start on destroy event page
   *
   * Remove this component
   *
   */
  ngOnDestroy() {
    this.subs.unsubscribe();
    this.subs2.unsubscribe();

    // remove self from modal service
    this.checkSessionService.remove(this);

    // remove modal element from html
    this.element.remove();
  }
}
