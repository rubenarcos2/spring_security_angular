import { Component, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { HelpService } from './services/help.service';
import { CheckSessionService } from './services/check-session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'GesMerCa';
  private _ttsSynth = new SpeechSynthesisUtterance();
  private _helpOpen = false;

  constructor(
    public authService: AuthService,
    private configService: ConfigService,
    private helpService: HelpService,
    private checkSessionService: CheckSessionService
  ) {}

  /**
   * Detect all click on page and play TTS with the content
   * Detect all mouse click on page and start/reset de idle timer
   */
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    if (!window.speechSynthesis.pending) {
      //When user is logged in check user config tts
      if (this.authService.isLoggedIn && this.configService.hasUserConfig('tts') == 'true')
        this.tts(event);
      //On all users if tts in general config
      else if (this.configService.hasConfig('tts') == 'true') this.tts(event);
    }

    this.checkSessionService.startResetIdleTimer();
  }

  /**
   * Detect F2 key event and open help window
   * Detect all key press on page and start/reset de idle timer
   */
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'F2') {
      if (!this._helpOpen) {
        this.helpService.open('help-modal');
        this._helpOpen = true;
      } else {
        this.helpService.close();
        this._helpOpen = false;
      }
    }

    this.checkSessionService.startResetIdleTimer();
  }

  /**
   * This function start on event page
   * Detect load on page and start/reset de idle timer
   */
  ngOnInit() {
    this.configService.getAll().subscribe();
    this._ttsSynth.lang = 'es-ES';

    if (this.authService.isLoggedIn) {
      this.checkSessionService.startCheckSession();
      this.checkSessionService.startResetIdleTimer();
    }
  }

  /**
   * On event play content with TTS speak
   *
   */
  tts(event: Event) {
    if (
      event.target !== document.body &&
      event.target !== document.getElementsByTagName('html')[0] &&
      event.target !== document.getElementsByClassName('help-modal')[0]
    ) {
      window.speechSynthesis.cancel();
      let selectObject = event.target as HTMLElement;
      if (selectObject.textContent !== '') this._ttsSynth.text = String(selectObject.textContent);
      else this._ttsSynth.text = String((selectObject as HTMLImageElement).alt);
      window.speechSynthesis.speak(this._ttsSynth);
    }
  }
}
