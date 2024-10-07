import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../commons/global-constants';

@Injectable({
  providedIn: 'root'
})
export class FormasContactoAsociadoService {
  private apiUrlformasContacto = GlobalConstants.apiURL + '/api/auth/asociado_permisos';

  constructor(private http: HttpClient) {}

  // Obtener todos los permisos de contacto
  getPermisos(): Observable<any> {
    return this.http.get(`${this.apiUrlformasContacto}`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un permiso de contacto por ID
  getPermisoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrlformasContacto}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo permiso de contacto
  createPermiso(permisoData: any): Observable<any> {
    return this.http.post(`${this.apiUrlformasContacto}/store`, permisoData).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un permiso de contacto existente
  updatePermiso(id: number, permisoData: any): Observable<any> {
    return this.http.put(`${this.apiUrlformasContacto}/update/${id}`, permisoData).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar el estado del habeas data
  updatePermisoHabeasData(habeasDataAceptado: boolean): Observable<any> {
    return this.http.put(`${this.apiUrlformasContacto}/habeas-data`, { habeasData: habeasDataAceptado }).pipe(
      catchError(this.handleError)
    );
  }

  // Manejador de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Error del servidor: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
