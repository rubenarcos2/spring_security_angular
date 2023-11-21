import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent, RoutesRecognized } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CheckSessionService } from 'src/app/services/check-session.service';
import { ConfigService } from 'src/app/services/config.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  private doc!: Document;
  private timer: any;
  private subs: Subscription = new Subscription();
  private subs2: Subscription = new Subscription();

  constructor(
    protected authService: AuthService,
    private configService: ConfigService,
    protected helpService: HelpService,
    protected checkSessionService: CheckSessionService,
    private toastr: ToastrService,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {}

  /**
   * This function start on event page
   *
   */
  ngOnInit(): void {
    this.router.events.subscribe(e => {
      if (e instanceof RouterEvent) {
        if (e instanceof RoutesRecognized) {
          this.createBreadcrumb(e.url);
        }
        if (e instanceof NavigationEnd) {
          //The user profile is reloaded because it is necessary to load the user's preferences in case of url change or page update.
          if (this.authService.isLoggedIn) {
            this.subs = this.authService.profile().subscribe();
            //Check each 15 minutes if user is active
            this.timer = setInterval(() => {
              this.checkSessionService.open('checkSession-modal');
            }, 900000);
          }
        }
      }
    });
  }

  /**
   * This function start on event load page
   *
   */
  ngOnLoad(): void {
    this.sharpContrast();
  }

  /**
   * This function start on event after view page
   *
   */
  ngAfterViewChecked() {
    //Check user config to if activate sharpcontrast
    if (this.authService.isLoggedIn && this.configService.isUserConfigLoaded)
      if (this.configService.hasUserConfig('sharpcontrast') == 'true') this.sharpContrast();
      else this.sharpContrastDeactivate();
    else if (this.configService.hasConfig('sharpcontrast') == 'true') this.sharpContrast();
    else this.sharpContrastDeactivate();
    this.doc = document;
  }

  /**
   * Send logout to backend and reset general configuration
   *
   */
  handleLogout() {
    //Send logout to backend
    this.subs2 = this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
        //Check user config to if activate sharpcontrast
        if (this.configService.hasUserConfig('sharpcontrast') == 'true')
          this.sharpContrastDeactivate();
      },
      error: error => {
        this.toastr.error(error ? error : 'No se puede conectar con el servidor');
      },
    });
  }

  /**
   * Generate route path of breadcrumb
   *
   */
  createBreadcrumb(url: string) {
    if (url === '/' || url.indexOf('?') > 0)
      document.getElementById('breadcrumb-nav')!.innerHTML = '';
    else {
      document.getElementById('breadcrumb-nav')!.innerHTML = '';
      let bol = document.createElement('ol');
      bol.className = 'breadcrumb breadcrumb-dividers-chevron';
      bol.setAttribute('style', 'padding-left: 1em;');
      let bc = document.createElement('li');
      bc.className = 'breadcrumb-item';
      let abc = document.createElement('a');
      abc.text = 'Inicio';
      abc.href = '/';
      abc.setAttribute('style', 'text-decoration: none; color: black;');
      bc.appendChild(abc);
      bol.appendChild(bc);
      document.getElementById('breadcrumb-nav')!.appendChild(bol);

      let paths = url.split('/');
      for (let i = 0; i < paths.length; i++) {
        if (paths[i].indexOf('?') != 0) {
          if (paths[i] !== '') {
            let bc = document.createElement('li');
            bc.className = 'breadcrumb-item';
            if (i < paths.length - 1 && paths[i] !== 'editar') {
              let abc = document.createElement('a');
              abc.text = paths[i];
              abc.href = url.substring(0, url.indexOf(paths[i]) + paths[i].length);
              abc.setAttribute('style', 'text-decoration: none; color: black;');
              bc.appendChild(abc);
            } else {
              bc.className += ' active';
              bc.setAttribute('aria-current', 'page');
              bc.textContent = paths[i];
            }
            document.getElementsByTagName('ol')[0].appendChild(bc);
          }
        }
      }
    }
  }

  /**
   * Set fullscreen page on click button event
   *
   */
  onFullscreen(event: any) {
    if (this.doc.documentElement.requestFullscreen) {
      this.router.navigate(['/']);
      this.doc.documentElement.requestFullscreen();
    }
    if (this.doc.exitFullscreen) {
      this.doc.exitFullscreen();
    }
  }

  /**
   * Set sharp contrast page
   *
   */
  sharpContrast(): void {
    let navBar = document.getElementsByTagName('nav')[0];
    let body = document.body as HTMLElement;
    let buttons = navBar.getElementsByTagName('a');
    let bcNav = document.getElementById('breadcrumb-nav');
    let bcUlItems = navBar.getElementsByTagName('ul');
    let ham = navBar.getElementsByTagName('button')[0];

    navBar.style.backgroundColor = 'black';
    navBar.style.boxShadow = '0 2px 2px -1px gray';
    navBar.style.color = 'white';
    body.style.backgroundColor = 'white';
    for (let i = 0; i < buttons.length; i++) {
      (buttons[i] as HTMLElement).style.color = 'white';
    }
    for (let i = 0; i < bcUlItems.length; i++) {
      (bcUlItems[i] as HTMLElement).style.backgroundColor = 'black';
    }
    if (bcNav != null) {
      bcNav.style.backgroundColor = 'black';
      bcNav.style.boxShadow = '0 2px 2px -1px gray';
      bcNav.style.color = 'white';
      let bcItems = bcNav.getElementsByTagName('li');
      for (let i = 0; i < bcItems.length; i++) {
        (bcItems[i] as HTMLElement).style.color = 'white';
      }

      let bcAItems = bcNav.getElementsByTagName('a');
      for (let i = 0; i < bcAItems.length; i++) {
        (bcAItems[i] as HTMLElement).style.color = 'white';
      }
    }
    ham.style.filter = 'invert(100%)';
  }

  /**
   * Unset sharp contrast page
   *
   */
  sharpContrastDeactivate(): void {
    let navBar = document.getElementsByTagName('nav')[0];
    let body = document.body;
    let buttons = navBar.getElementsByTagName('a');
    let bcNav = document.getElementById('breadcrumb-nav');
    let bcUlItems = navBar.getElementsByTagName('ul');
    let ham = navBar.getElementsByTagName('button')[0];

    body.style.removeProperty('background-color');
    navBar.style.removeProperty('background-color');
    navBar.style.boxShadow = '0 2px 2px -1px var(--color-orange)';
    navBar.style.removeProperty('color');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.removeProperty('color');
    }
    for (let i = 0; i < bcUlItems.length; i++) {
      bcUlItems[i].style.removeProperty('background-color');
    }
    if (bcNav != null) {
      bcNav.style.removeProperty('background-color');
      bcNav.style.boxShadow = '0 2px 2px -1px var(--color-orange)';
      bcNav.style.removeProperty('color');
      let bcItems = bcNav.getElementsByTagName('li');
      for (let i = 0; i < bcItems.length; i++) {
        bcItems[i].style.removeProperty('color');
      }

      let bcAItems = bcNav.getElementsByTagName('a');
      for (let i = 0; i < bcAItems.length; i++) {
        bcAItems[i].style.removeProperty('color');
      }
    }
    ham.style.removeProperty('filter');
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
}
