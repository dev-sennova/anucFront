import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GlobalConstants } from '../commons/global-constants';

@Injectable({
  providedIn: 'root'
})
export class EmpresaGlobalesService {

  private apiUrl = GlobalConstants.apiURL + '/api/auth/empresa_globales/selectempresa_globales/1';
  private apiUrlPublico = GlobalConstants.apiURL + '/api/auth/empresa_globales_publico';
  private apiUrlEstadisticas = GlobalConstants.apiURL + '/api/auth/empresa_globales/estadisticas';
  private apiUrlUpdate = GlobalConstants.apiURL + '/api/auth/empresa_globales'

  constructor(private http: HttpClient) { }

  getEmpresaGlobales(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        if (response.estado === "Ok" && response.empresa) {
          return response.empresa[0]; // Asumiendo que siempre hay al menos una empresa en la respuesta
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      }),
      catchError(this.handleError)
    );
  }

  getEmpresaPublico(): Observable<any> {
    return this.http.get<any>(this.apiUrlPublico).pipe(
      map(response => {
        if (response.estado === "Ok" && response.empresa) {
          return response.empresa[0]; // Asumiendo que siempre hay al menos una empresa en la respuesta
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      }),
      catchError(this.handleError)
    );
  }

  getEmpresa(): Observable<any> {
    return this.http.get<any>(this.apiUrlUpdate).pipe(
      map(response => {
        if (response.estado === "Ok" && response.empresa) {
          return response; // Asumiendo que siempre hay al menos una empresa en la respuesta
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      }),
      catchError(this.handleError)
    );
  }

  updateEmpresa(empresa: any): Observable<any> {
    const url = `${this.apiUrlUpdate}/update`;
    return this.http.put<any>(url, empresa).pipe(
      catchError(this.handleError)
    );
  }

  getEmpresaEstadisticas(): Observable<any> {
    return this.http.get<any>(this.apiUrlEstadisticas).pipe(
      map(response => {
        if (response.estado === "Ok") {
          return response;
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      }),
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
