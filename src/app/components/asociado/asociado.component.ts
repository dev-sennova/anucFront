import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asociado',
  templateUrl: './asociado.component.html',
  styleUrls: ['./asociado.component.css']
})
export class AsociadoComponent {

  constructor(public router: Router){}

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

  cerrarSesion() {
    let removeToken = localStorage.removeItem('access_token');
    localStorage.clear();
    if (removeToken == null) {
      this.router.navigate(['home']);
    }
  }

  toggleProfileMenu() {
    const profileMenu = document.getElementById('profile-menu');
    if (profileMenu) {
      profileMenu.classList.toggle('active');
    }
  }
  

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const profileMenu = document.getElementById('profile-menu');
    const profileIcon = document.getElementById('profile_icon');
    if (profileMenu && profileIcon) {
      const target = event.target as HTMLElement;
      if (!profileMenu.contains(target) && !profileIcon.contains(target)) {
        profileMenu.classList.remove('active');
      }
    }
  }

}
