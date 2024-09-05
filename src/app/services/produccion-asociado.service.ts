import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from '../commons/global-constants';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProduccionAsociadoService {

  private apiUrl = GlobalConstants.apiURL + '/api/auth/produccion'; // Actualiza esta URL según tu configuración

  constructor(private http: HttpClient) { }

  getProducciones(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.produccion),
      catchError(this.handleError)
    );
  }

  addProduccion(produccion: any): Observable<any> {
    const url = `${this.apiUrl}/store`;
    return this.http.post<any>(url, produccion).pipe(
      catchError(this.handleError)
    );
  }

  updateProduccion(produccion: any): Observable<any> {
    const url = `${this.apiUrl}/update`;
    return this.http.put<any>(url, produccion).pipe(
      catchError(this.handleError)
    );
  }

  activateProduccion(id: string): Observable<any> {
    const url = `${this.apiUrl}/activate`;
    return this.http.put<any>(url, { id }).pipe(
      catchError(this.handleError)
    );
  }

  deactivateProducciond(id: string): Observable<any> {
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
