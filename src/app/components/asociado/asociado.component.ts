import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-asociado',
  templateUrl: './asociado.component.html',
  styleUrls: ['./asociado.component.css']
})
export class AsociadoComponent {

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
