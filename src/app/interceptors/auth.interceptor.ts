import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener el token de autenticación
    const authToken = this.authService.getToken();

    // Clonar la solicitud y agregar los encabezados necesarios
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`, // Añadir el token de autorización
        'Access-Control-Allow-Origin': '*'      // Añadir el encabezado CORS (generalmente esto lo maneja el backend)
      }
    });

    // Continuar con la solicitud modificada
    return next.handle(clonedRequest);
  }
}
