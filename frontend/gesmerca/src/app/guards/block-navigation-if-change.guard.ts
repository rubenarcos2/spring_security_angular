import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import { CheckSessionService } from '../services/check-session.service';

@Injectable({ providedIn: 'root' })
export class CanDeactivateBlockNavigationIfChange {
  constructor(private checkSessionService: CheckSessionService) {}

  canDeactivate(component: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //TODO: not visible when session popup is visible or finished
    if (
      component.isFormUpdating &&
      (!this.checkSessionService.isIdleTimerActive() ||
        !this.checkSessionService.isCheckSessionActive())
    )
      return window.confirm('Hay cambios sin guardar\n\n ¿Desea salir y perder los cambios?');
    else return true;
  }
}
