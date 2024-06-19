import { Component } from '@angular/core';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {

  openMenu() {
    document.getElementById('menu')!.classList.add('open');
    document.getElementById('overlay')!.classList.add('active');
    document.getElementById('menu-btn')!.classList.add('hidden');
  }

  closeMenu() {
    document.getElementById('menu')!.classList.remove('open');
    document.getElementById('overlay')!.classList.remove('active');
    document.getElementById('menu-btn')!.classList.remove('hidden');
  }

}
