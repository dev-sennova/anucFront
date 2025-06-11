import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  usuario: string;
  password: string;
  roles: any[] = [];
  showRoleSelection: boolean = false;
  private roleSelectionSub!: Subscription;

  constructor(public loginService: LoginService, public router: Router) {
    this.usuario = "";
    this.password = "";
  }

  login() {
    const user = { identificacion: this.usuario, password: this.password };
    this.loginService.signIn(user);

  }

  loginFake() {
    this.router.navigate(['home']);
  }

  ngOnInit(): void {
    this.roleSelectionSub = this.loginService.openRoleSelection$.subscribe(() => {
      this.checkRoles();
    });
  }

  ngOnDestroy(): void {
    this.roleSelectionSub.unsubscribe();
  }

  checkRoles() {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    if (roles.length > 1) {
      this.showRoleSelection = true;
      this.roles = roles;
    } else {
      this.showRoleSelection = false;
    }
  }

  selectRole(role: any) {

    localStorage.setItem('idRol_usuario', role.idRol);
    localStorage.setItem('rol_usuario', role.rol);
    console.log('idRol_usuario', role.idRol)
    console.log('idRol_usuario type', typeof(role.idRol))
    if (role.idRol == 1 || role.idRol == 2) {
      this.router.navigate(['/administrador']);

    } else if (role.idRol == 3) {
      this.router.navigate(['/asociado']);
    } 
  }

  closeModal() {
    this.loginService.doLogout();
    this.showRoleSelection = false;
  }

  validateNumberInput(event: any) {
    const inputValue = event.target.value;
    // Solo permitir números
    event.target.value = inputValue.replace(/[^0-9]/g, '');
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  
  navigateHome() {
    this.router.navigate(['/home']);
  }
  
  



}
