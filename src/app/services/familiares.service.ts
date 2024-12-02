import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from '../commons/global-constants';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FamiliaresService {

  private apiUrl = GlobalConstants.apiURL + '/api/auth/familiares';

  constructor(private http: HttpClient) { }

  getFamiliares(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.familiares),
      catchError(this.handleError)
    );
  }

  addFamiliar(familiares: any): Observable<any> {
    const url = `${this.apiUrl}/store`;
    console.log("Url familiar: ", url);
    console.log("Objeto enviado: ", familiares);
    return this.http.post<any>(url, familiares).pipe(
      catchError(this.handleError)
    );
  }

  updateFamiliar(familiares: any): Observable<any> {
    const url = `${this.apiUrl}/update`;
    return this.http.put<any>(url, familiares).pipe(
      catchError(this.handleError)
    );
  }

  activateFamiliar(id: string): Observable<any> {
    const url = `${this.apiUrl}/activate`;
    return this.http.put<any>(url, { id }).pipe(
      catchError(this.handleError)
    );
  }

  deactivateFamiliar(id: string): Observable<any> {
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
