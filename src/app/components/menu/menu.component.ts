import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  menuOpen = false;

  constructor(private router: Router){}

  toggleMenu(event: Event) {
    event.stopPropagation(); // Evitar que se cierre el menú si se hace clic en el botón
    this.menuOpen = !this.menuOpen;
  }

  // Cerrar menú al hacer clic fuera del área de menú
  @HostListener('document:click', ['$event'])
  closeMenuOnClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-links') && !target.closest('.menu-toggle')) {
      this.menuOpen = false;
    }
  }

  // Cerrar menú al hacer scroll en la página
  @HostListener('window:scroll', [])
  closeMenuOnScroll() {
    if (this.menuOpen) {
      this.menuOpen = false;
    }
  }

  reiniciar(): void{
    this.router.navigate(['/home']);
    location.reload();

  }
}
