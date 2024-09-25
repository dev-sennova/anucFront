import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from '../commons/global-constants';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private apiUrl = GlobalConstants.apiURL + '/api/auth/rol'; // Actualiza esta URL según tu configuración

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.rol),
      catchError(this.handleError)
    );
  }

  addRol(rol: any): Observable<any> {
    const url = `${this.apiUrl}/store`;
    return this.http.post<any>(url, rol).pipe(
      catchError(this.handleError)
    );
  }

  updateRol(rol: any): Observable<any> {
    const url = `${this.apiUrl}/update`;
    return this.http.put<any>(url, rol).pipe(
      catchError(this.handleError)
    );
  }

  activateRol(id: string): Observable<any> {
    const url = `${this.apiUrl}/activate`;
    return this.http.put<any>(url, { id }).pipe(
      catchError(this.handleError)
    );
  }

  deactivateRol(id: string): Observable<any> {
    const url = `${this.apiUrl}/deactivate`;
    return this.http.put<any>(url, { id }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
