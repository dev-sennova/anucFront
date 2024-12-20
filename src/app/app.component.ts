import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'anucFront';

  showMenu: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showMenu = !(
          event.url.startsWith('/login') ||
          event.url.startsWith('/asociado') ||
          event.url.startsWith('/administrador') ||
          event.url.startsWith('/crearcontrasena') 
        );
      }
    });
  }
}
