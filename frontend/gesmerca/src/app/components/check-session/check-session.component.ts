import { Component, ElementRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
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
  protected mp4url: any;
  protected webmurl: any;

  constructor(
    protected checkSessionService: CheckSessionService,
    private authService: AuthService,
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
   * This function start on destroy event page
   *
   * Remove this component
   *
   */
  ngOnDestroy() {
    // remove self from modal service
    this.checkSessionService.remove(this);

    // remove modal element from html
    this.element.remove();
  }

  /**
   * Set visible this component
   *
   */
  open() {
    this.element.style.display = 'block';
    document.body.classList.add('checkSession-modal-open');
    this.isOpen = true;
  }

  /**
   * Set hidden this component
   *
   */
  close() {
    this.element.style.display = 'none';
    document.body.classList.remove('checkSession-modal-open');
    this.authService.refresh(null).subscribe();
    //this.authService.profile().subscribe();
    this.isOpen = false;
  }
}
