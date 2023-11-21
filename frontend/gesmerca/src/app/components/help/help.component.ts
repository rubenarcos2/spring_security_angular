import { Component, ElementRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';
import { Router } from '@angular/router';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HelpComponent implements OnInit, OnDestroy {
  @Input() id?: string;
  isOpen = false;
  private element: any;
  protected mp4url: any;
  protected webmurl: any;

  constructor(protected helpService: HelpService, private router: Router, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  /**
   * This function start on event page
   *
   * Initialize this component and event listener on click button to open
   *
   */
  ngOnInit() {
    // add self (this modal instance) to the modal service so it can be opened from any component
    this.helpService.add(this);

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener('click', (el: any) => {
      if (el.target.className === 'help-modal') {
        this.close();
      }
    });

    this.element.style.display = 'none';
  }

  /**
   * Set visible this component
   *
   */
  open() {
    this.changeSrcVideo();
    this.element.style.display = 'block';
    document.body.classList.add('help-modal-open');
    this.isOpen = true;
  }

  /**
   * Set hidden this component
   *
   */
  close() {
    (document.getElementById('help-video') as HTMLVideoElement).pause();
    this.element.style.display = 'none';
    document.body.classList.remove('help-modal-open');
    this.isOpen = false;
  }

  /**
   * Detect from url the name of help's video
   *
   */
  changeSrcVideo() {
    this.element.style.display = 'none';
    //Load video url from url navigation bar
    let videoSrc = '../../assets/video';
    let videoName = this.router.url == '/' ? '/home' : this.router.url;
    if (videoName.match(/(\d+)/)) {
      let v = videoName.split('/');
      videoName = '/';
      for (let i = 1; i < v.length - 1; i++) {
        if (i != v.length - 2) videoName += v[i] + '-';
        else videoName += v[i];
      }
    } else {
      videoName = '/' + videoName.substring(1).replace('/', '-');
    }
    this.mp4url = videoSrc + videoName + '.mp4';
    this.webmurl = videoSrc + videoName + '.webm';
    (document.getElementById('help-video') as HTMLVideoElement).load();
  }

  /**
   * This function start on destroy event page
   *
   * Unsuscribe all observable suscriptions
   *
   */
  ngOnDestroy() {
    // remove self from modal service
    this.helpService.remove(this);

    // remove modal element from html
    this.element.remove();
  }
}
