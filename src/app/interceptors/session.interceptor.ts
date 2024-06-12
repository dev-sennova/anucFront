import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class SessionInterceptor implements HttpInterceptor {

  constructor(private authenticationService: LoginService, public router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
        if (err.status === 401) {
            // auto logout if 401 response returned from api
            this.authenticationService.doLogout();
            Swal.fire('No pudo autenticarse, por favor ingrese nuevamente')
            this.router.navigate(['login']);
        }
        //        const error = "Sesión expirada, por favor ingrese nuevamente";
        //        const error = err.status;
        //        return throwError(error);
        return throwError(err);
    }))
}

}
