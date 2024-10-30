import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from '../commons/global-constants';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  private apiUrl = GlobalConstants.apiURL + '/api/auth/grupos';
  constructor(private http: HttpClient) { }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    Swal.fire('Error', errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }

  // Obtener todos los grupos
  getGrupos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un solo grupo por ID
  getGrupoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/one`, { params: { id: id.toString() } }).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo grupo
  createGrupo(grupo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, grupo).pipe(
      map(response => {
        Swal.fire('Creado', 'El grupo ha sido creado con éxito', 'success');
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // Actualizar un grupo existente
  updateGrupo(id: number, grupo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, { ...grupo, id }).pipe(
      map(response => {
        Swal.fire('Actualizado', 'El grupo se actualizó con éxito', 'success');
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // Desactivar un grupo
  deactivateGrupo(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/deactivate`, { id }).pipe(
      map(response => {
        Swal.fire('Desactivado', 'El grupo ha sido desactivado con éxito', 'info');
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // Activar un grupo
  activateGrupo(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/activate`, { id }).pipe(
      map(response => {
        Swal.fire('Activado', 'El grupo ha sido activado con éxito', 'success');
        return response;
      }),
      catchError(this.handleError)
    );
  }
}
