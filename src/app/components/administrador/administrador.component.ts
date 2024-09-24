import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {

  password: string = '';
  confirmPassword: string = '';

  constructor(public router: Router, private loginService: LoginService){}

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

  cerrarSesion() {
    let removeToken = localStorage.removeItem('access_token');
    localStorage.clear();
    if (removeToken == null) {
      this.router.navigate(['home']);
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

  closeModal() {
    const modal = document.getElementById("passwordModal");
    if (modal) {
      modal.style.display = "none";
    }
  }
  

  openModal() {
    // Cerrar el profile-menu si está abierto
    const profileMenu = document.getElementById('profile-menu');
    if (profileMenu && profileMenu.classList.contains('active')) {
      profileMenu.classList.remove('active');
    }
  
    // Abrir el modal de cambio de contraseña
    const modal = document.getElementById("passwordModal");
    if (modal) {
      modal.style.display = "block";
    }
  }
  
  
  onSubmit() {
    if (this.password !== this.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }
  
    const userId = localStorage.getItem('identificador_usuario');
    if (userId) {
      this.loginService.updatePassword(userId, this.password).subscribe(
        response => {
          Swal.fire('Éxito', 'La contraseña ha sido actualizada', 'success');
          this.closeModal();
        },
        error => {
          Swal.fire('Error', 'No se pudo actualizar la contraseña', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Usuario no encontrado', 'error');
    }
  }

}
