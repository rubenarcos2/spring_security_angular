import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent implements OnInit {
  constructor(private router: Router, private meta: Meta) {
    //Redirect to init page at 5 seconds
    this.meta.addTag({ httpEquiv: 'refresh', content: '5;url=/' }, true);
  }

  /**
   * This function start on event page
   *
   */
  ngOnInit(): void {}
}
