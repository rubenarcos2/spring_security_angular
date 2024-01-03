import { Injectable } from '@angular/core';
import { CheckSessionComponent } from '../components/check-session/check-session.component';
import TokenUtils from '../utils/tokenUtils';
import { Observable, Subject, interval, map, take, takeUntil, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckSessionService {
  private modals: CheckSessionComponent[] = [];
  private stopperSessionTimer = new Subject<boolean>();
  private sessionTimer: Observable<any> = new Observable();
  private stopperUserIdleTimer = new Subject<boolean>();
  private userIdleTimer: Observable<number> = new Observable();
  /*
   * Time in milliseconds between server session timeout and client timeout warning
   * 5 minutes of lag to correctly logout an 1.5 minutes to user's action
   */
  public static readonly SESSION_COURTESY_TIME: number = 300000; // 5 min.
  public static readonly SESSION_USER_COUNT_DOWN_TIME: number = 90000; // 1min. 30 sec.
  private static readonly IDLE_USER_COUNTER_TIME: number = 300000; // 5 min.
  public static readonly IDLE_USER_COUNT_DOWN: number = 60; //In seconds

  add(modal: CheckSessionComponent) {
    // ensure component has a unique id attribute
    if (!modal.id || this.modals.find(x => x.id === modal.id)) {
      throw new Error('modal must have a unique id attribute');
    }

    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(modal: CheckSessionComponent) {
    // remove modal from array of active modals
    this.modals = this.modals.filter(x => x === modal);
  }

  open(id: string, time?: any) {
    // open modal specified by id
    const modal = this.modals.find(x => x.id === id);

    if (!modal) {
      throw new Error(`modal '${id}' not found`);
    }

    modal.open(time);
  }

  cancel() {
    const modal = this.modals.find(x => x.isOpen);
    modal?.cancel();
  }

  close() {
    const modal = this.modals.find(x => x.isOpen);
    modal?.close();
  }

  /*
   * Check if user is active from token expires' time
   *
   * Start a timer with token life time less 5 minutes:
   * one minute to count down user action and other to logout successful on cancel case.
   */
  startCheckSession() {
    if (sessionStorage.getItem('authUser')) {
      //console.warn('Start/Reset session timer ' + new Date().toLocaleTimeString());
      this.sessionTimer = timer(0, 1000).pipe(takeUntil(this.stopperSessionTimer));
      this.sessionTimer.subscribe(() => {
        let now = new Date().getTime();
        let timeToken = new Date(
          TokenUtils.tokenExpirationTime() * 1000 - CheckSessionService.SESSION_COURTESY_TIME
        ).getTime();
        if (
          now >=
          new Date(
            TokenUtils.tokenExpirationTime() * 1000 -
              CheckSessionService.SESSION_COURTESY_TIME -
              CheckSessionService.SESSION_USER_COUNT_DOWN_TIME
          ).getTime()
        ) {
          if (this.modals.find(x => x.isOpen)) this.modals.find(x => x.isOpen)?.close();
          this.stopCheckSession();
          this.open('checkSession-modal', timeToken - now);
        }
      });
    } else {
      this.stopCheckSession();
    }
  }

  stopCheckSession() {
    this.stopperSessionTimer.next(true);
  }

  public isCheckSessionActive = () => this.sessionTimer;

  startResetIdleTimer() {
    if (sessionStorage.getItem('authUser') && !this.modals.find(x => x.isOpen)) {
      //console.warn('Start/Reset idle timer ' + new Date().toLocaleTimeString());
      this.stopIdleTimer();

      this.userIdleTimer = interval(CheckSessionService.IDLE_USER_COUNTER_TIME).pipe(
        takeUntil(this.stopperUserIdleTimer)
      );
      this.userIdleTimer.subscribe(() => {
        if (!this.modals.find(x => x.isOpen)) {
          this.stopIdleTimer();
          this.open('checkSession-modal');
        }
      });
    } else {
      this.stopIdleTimer();
    }
  }

  stopIdleTimer() {
    this.stopperUserIdleTimer.next(true);
  }

  public isIdleTimerActive = () => this.userIdleTimer;
}
