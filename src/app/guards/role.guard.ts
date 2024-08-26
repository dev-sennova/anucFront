import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const loginService = inject(LoginService);
  const router = inject(Router);

  // Obtén los roles esperados desde los datos de la ruta
  const expectedRoles = route.data['roles'] as Array<string>;
  
  // Obtén el rol del usuario desde el servicio de login o desde el localStorage
  const userRole = localStorage.getItem('rol_usuario');

  if (userRole && expectedRoles.includes(userRole)) {
    // Si el rol del usuario está en la lista de roles permitidos, permite el acceso
    return true;
  } else {
    // Si no, redirige al usuario a la ruta de inicio según su rol
    switch (userRole) {
      case 'Administrador':
        router.navigate(['administrador/inicio']);
        break;
      case 'Asociado':
        router.navigate(['asociado/inicio-asociado']);
        break;
      // Puedes añadir más casos según los roles que manejes
      default:
        router.navigate(['home']);
        break;
    }
    return false;
  }


};
