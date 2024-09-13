import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from '../commons/global-constants';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FincasService {

  private apiUrl = GlobalConstants.apiURL + '/api/auth/finca'; 
  private apiUrlOneFinca = GlobalConstants.apiURL + '/api/auth/finca/selectfinca';// Actualiza esta URL según tu configuración

  constructor(private http: HttpClient) { }

  getFincas(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.finca),
      catchError(this.handleError)
    );
  }

  getFinca(id: string): Observable<any> {
    const url = `${this.apiUrlOneFinca}/${id}`;
    return this.http.get<any>(url).pipe(
      map(response => response.finca),
      catchError(this.handleError)
    );
  }

  addFinca(finca: any): Observable<any> {
    const url = `${this.apiUrl}/store`;
    return this.http.post<any>(url, finca).pipe(
      catchError(this.handleError)
    );
  }

  updateFinca(finca: any): Observable<any> {
    const url = `${this.apiUrl}/update`;
    return this.http.put<any>(url, finca).pipe(
      catchError(this.handleError)
    );
  }

  activateFinca(id: string): Observable<any> {
    const url = `${this.apiUrl}/activate`;
    return this.http.put<any>(url, { id }).pipe(
      catchError(this.handleError)
    );
  }

  deactivateFinca(id: string): Observable<any> {
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
