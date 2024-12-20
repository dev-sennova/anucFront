import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from '../commons/global-constants';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class OfertasAsociadoService {

  private apiUrlOfertasPublicas = GlobalConstants.apiURL + '/api/auth/ofertaspublicas';
  private apiUrlOfertas = GlobalConstants.apiURL + '/api/auth/ofertas';
  private apiUrlOfertasAsociado = GlobalConstants.apiURL + '/api/auth/asociados/ofertas';
  private apiUrlAsociacionAsociado = GlobalConstants.apiURL + '/api/auth/asociados_finca/selectasociados_fincaAsociado';


  constructor(private http: HttpClient) { }

  getAsociacion(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlAsociacionAsociado}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getOfertas(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlOfertasAsociado}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getOfertaPublicas(): Observable<any> {
    return this.http.get<any>(this.apiUrlOfertasPublicas).pipe(
      catchError(this.handleError)
    );
  }

  addOferta(oferta: any, asociados_finca_id: string): Observable<any> {
    const url = `${this.apiUrlOfertas}/store`;
    const body = { ...oferta, asociados_finca_id };
    console.log("Body Sent: ",body);
    return this.http.post<any>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  updateOferta(oferta: any, asociados_finca_id: string): Observable<any> {
    const url = `${this.apiUrlOfertas}/update`;
    const body = { ...oferta, asociados_finca_id };
    return this.http.put<any>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  deactivateOferta(id: number): Observable<any> {
    const url = `${this.apiUrlOfertas}/deactivate`;
    return this.http.put<any>(url, { id }).pipe(
      catchError(this.handleError)
    );
  }

  activateOferta(id: number): Observable<any> {
    const url = `${this.apiUrlOfertas}/activate`;
    return this.http.put<any>(url, { id }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}
