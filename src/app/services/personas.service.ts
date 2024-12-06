import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from '../commons/global-constants';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  private apiUrl = GlobalConstants.apiURL + '/api/auth/personas';
  private apiUrlInfoAsociados = GlobalConstants.apiURL + '/api/auth/asociados/detallado';
  private apiUrlInfoAsociadosFamiliares = GlobalConstants.apiURL + '/api/auth/asociados/familiares';
  private apiUrlInfoByAsociado = GlobalConstants.apiURL + '/api/auth/produccion/selectproduccionByAsociado';
  private apiUrlOnePersona = GlobalConstants.apiURL + '/api/auth/personas/selectpersonas';


  constructor(private http: HttpClient) { }

  getPersonas(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.personas),
      catchError(this.handleError)
    );
  }

  getPersona(id:string): Observable<any> {
    const url = `${this.apiUrlOnePersona}/${id}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    )
  }

  getPerson(id:string): Observable<any> {
    const url = `${this.apiUrlOnePersona}/${id}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    )
  }


  getInfoOneAsociado(id: string): Observable<any> {
    const url = `${this.apiUrlInfoAsociados}/${id}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }


  getInfoOneAsociadoProductos(id: string): Observable<any> {
    const url = `${this.apiUrlInfoAsociados}/${id}`;
    return this.http.get<any>(url).pipe(
      map(response => response.produccion),
      catchError(this.handleError)
    );
  }


  getProductosByAsociado(id: string): Observable<any> {
    const url = `${this.apiUrlInfoByAsociado}/${id}`;
    return this.http.get<any>(url).pipe(
      map(response => response.produccion),
      catchError(this.handleError)
    );
  }

  getInfoOneFamiliares(id: string): Observable<any> {
    const url = `${this.apiUrlInfoAsociadosFamiliares}/${id}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }



  getInfoAsociado(asociado: number): Observable<any> {
    const url = `${this.apiUrlInfoAsociados}/${asociado}`;
    return this.http.get<any>(url).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  addPersona(persona: any): Observable<any> {
    const url = `${this.apiUrl}/store`;
    return this.http.post<any>(url, persona).pipe(
      catchError(this.handleError)
    );
  }

  updatePersona(persona: any): Observable<any> {
    const url = `${this.apiUrl}/update`;
    return this.http.put<any>(url, persona).pipe(
      catchError(this.handleError)
    );
  }

  activatePersona(id: string): Observable<any> {
    const url = `${this.apiUrl}/activate`;
    return this.http.put<any>(url, { id }).pipe(
      catchError(this.handleError)
    );
  }

  deactivatePersona(id: string): Observable<any> {
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
