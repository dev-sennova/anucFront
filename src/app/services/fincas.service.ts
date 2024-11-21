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
  private apiFincaStore = GlobalConstants.apiURL+ '/api/auth/finca/store';
  private apiAsociadoFinca = GlobalConstants.apiURL+ '/api/auth/asociados_finca/store';
  private apiPredio = GlobalConstants.apiURL+ '/api/auth/tipo_predio';
  private apiAsociado = GlobalConstants.apiURL+ '/api/auth/finca/selectfinca/';
  
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
      map(response => response.finca[0]), // Accede al primer elemento del array
      catchError(this.handleError)
    );
}

  

  addFinca(finca: any): Observable<any> {
    const url = `${this.apiUrl}/store`;
    return this.http.post<any>(url, finca).pipe(
      catchError(this.handleError)
    );
  }

  storeFinca(fincaData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    console.log('Datos enviados para crear la finca:', fincaData); // Verifica los datos enviados
    return this.http.post<any>(this.apiFincaStore, fincaData, { headers }).pipe(
      map(response => {
        console.log('Respuesta de storeFinca:', response); // Verifica la respuesta completa
        return response;
      }),
      catchError(this.handleError)
    );
  }
  
  

  updateFinca(finca: any): Observable<any> {
    const url = `${this.apiUrl}/update`;
    return this.http.put<any>(url, finca).pipe(
      map(response => {
        console.log('Respuesta del servidor al actualizar la finca:', response);
        return response;
      }),
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


// Actualiza este método en fincas.service.ts
asociarFincaConAsociado(finca: string, asociado: string, tipo_predio: string): Observable<any> {
  const url = this.apiAsociadoFinca; // Utiliza la URL completa
  const body = { finca, asociado, tipo_predio };
  console.log('Datos enviados al backend:', body); // Log para verificar datos enviados
  return this.http.post<any>(url, body).pipe(
    catchError(this.handleError)
  );
}


getTiposPredio(): Observable<any> {
  const url = `${this.apiPredio}`;
  return this.http.get<any>(url).pipe(
    map(response => {
      console.log('Respuesta de getTiposPredio:', response); // Verifica la respuesta completa
      return response.tipo_predio; // Asegúrate de que esto coincide con el formato de tu respuesta
    }),
    catchError(this.handleError)
  );
}

getFincaByAsociado(idAsociado: string): Observable<any> {
  const url = `${this.apiUrl}/asociado/${idAsociado}`;
  return this.http.get<any>(url).pipe(
    map(response => response.finca),
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
