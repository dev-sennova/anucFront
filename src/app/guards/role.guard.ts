import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const loginService = inject(LoginService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as Array<string>;
  
  const userRole = localStorage.getItem('rol_usuario');

  if (userRole && expectedRoles.includes(userRole)) {
    return true;
  } else {
    switch (userRole) {
      case 'Administrador' || 'SuperAdministrador':
        router.navigate(['administrador/inicio']);
        break;
      case 'Asociado':
        router.navigate(['asociado/inicio-asociado']);
        break;
      default:
        router.navigate(['home']);
        break;
    }
    return false;
  }


};
