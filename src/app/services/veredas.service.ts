import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from '../commons/global-constants';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class VeredasService {

  private apiUrl = GlobalConstants.apiURL + '/api/auth/vereda'; // Actualiza esta URL según tu configuración

  constructor(private http: HttpClient) { }

  getVeredas(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.veredas),
      catchError(this.handleError)
    );
  }

  addVereda(veredas: any): Observable<any> {
    const url = `${this.apiUrl}/store`;
    return this.http.post<any>(url, veredas).pipe(
      catchError(this.handleError)
    );
  }

  updateVereda(veredas: any): Observable<any> {
    const url = `${this.apiUrl}/update`;
    return this.http.put<any>(url, veredas).pipe(
      catchError(this.handleError)
    );
  }

  activateVereda(id: string): Observable<any> {
    const url = `${this.apiUrl}/activate`;
    return this.http.put<any>(url, { id }).pipe(
      catchError(this.handleError)
    );
  }

  deactivateVereda(id: string): Observable<any> {
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
