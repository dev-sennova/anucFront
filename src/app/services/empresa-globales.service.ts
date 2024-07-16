import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GlobalConstants } from '../commons/global-constants';

@Injectable({
  providedIn: 'root'
})
export class EmpresaGlobalesService {

  private apiUrl = GlobalConstants.apiURL + '/api/auth/empresa_globales/selectempresa_globales/1'; // Actualiza esta URL según tu configuración

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
