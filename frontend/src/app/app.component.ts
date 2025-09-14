import { Component } from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {PlayBarComponent} from './components/play-bar/play-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PlayBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  is_error_page = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.is_error_page = event.urlAfterRedirects === '/404';
      }
    })
  }
}
