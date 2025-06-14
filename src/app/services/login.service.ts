/* Comentarios respecto al uso
Este servicio controla la autenticación y el almacenamiento del token en local storage, de igual forma hace uso del manejo
adecuado del mismo al momento del logout; el endpoint no se trabaja como global dado que apunta a otro servidor; la ruta se
establece en el archivo proxy para evitar el error de cors; al momento de recibir respuesta correcta redirecciona al componente
indicado; en este caso un componente en blanco llamado home.
*/

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalConstants } from '../commons/global-constants';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private urlBase = GlobalConstants.apiURL;

  //private urlBase='http://127.0.0.1:8000';

  private endpointGlobales = 'api/auth/variables_globales';

  private endpoint = 'api/auth/login';

  private endpointRegister = 'api/auth/register';

  private apiUrlUpdatePassword = 'api/auth/asociados/passwordupdate';


  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  idUsuario: any;
  globales: any;

  private openRoleSelectionSubject = new Subject<void>();
  openRoleSelection$ = this.openRoleSelectionSubject.asObservable();

  constructor(private http: HttpClient, public router: Router) { }

  // Sign-in
  signIn(user: any) {
    console.log("Url: " + `${this.urlBase}/${this.endpoint}`);
    console.log("Usuario: " + JSON.stringify(user));

    return this.http.post<any>(`${this.urlBase}/${this.endpoint}`, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('documento_usuario', res.identificacion);
        localStorage.setItem('identificador_usuario', res.id_usuario);
        localStorage.setItem('identificador_persona', res.id_persona);
        localStorage.setItem('identificador_asociado', res.id_asociado);
        localStorage.setItem('identificador_asociado_finca', res.id_asociados_finca);
        localStorage.setItem('nombre_usuario', res.nombres);
        localStorage.setItem('apellido_usuario', res.apellidos);

        // Si solo es un rol lo Adjudico y redirijo segun rol
        // Si es mas de un rol Adjudico rol mas alto y redirijo a eleccion de rol
        localStorage.setItem('idRol_usuario', res.roles[0].idRol);
        localStorage.setItem('rol_usuario', res.roles[0].rol);
        localStorage.setItem('roles', JSON.stringify(res.roles));

        if (res.numeroRoles === 1) {


          if (res.roles[0].idRol == 1) {
            this.router.navigate(['administrador']);
          }

          if (res.roles[0].idRol == 2) {
            this.router.navigate(['administrador']);
          }

          if (res.roles[0].idRol == 3) {
            this.router.navigate(['asociado']);
          }

        } else {
          this.openRoleSelectionSubject.next();
        }

        console.log("Item idUsuario: " + localStorage.getItem('identificador_usuario'));
        console.log("Item rol: " + localStorage.getItem('rol_usuario'));
        //console.log("Token: "+res.access_token);
      })
  }

  public crearAsociado(user: any): Observable<any> {
    return this.http.post(`${this.urlBase}/${this.endpointRegister}`, user)
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getUsuario() {
    return localStorage.getItem('nombre_usuario');
  }

  getIdUsuario() {
    return localStorage.getItem('identificador_usuario');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  get isLoggedOut(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken === null) ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    localStorage.clear();
    if (removeToken == null) {
      this.router.navigate(['auth']);
    }
  }

  updatePassword(id: string, password: string): Observable<any> {
    const url = `${this.urlBase}/api/auth/asociados/passwordupdate`;
    const body = { id, password };
    
    return this.http.put<any>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  public lecturaGlobales(): Observable<any> {
    return this.http.get(`${this.urlBase}/${this.endpointGlobales}`);
  }
}
