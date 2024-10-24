import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../commons/global-constants';

@Injectable({
  providedIn: 'root'
})
export class FormasContactoAsociadoService {
  
  private apiUrlformasContacto = GlobalConstants.apiURL + '/api/auth/asociado_permisos';
  private apiUrlHabeasData = GlobalConstants.apiURL + '/api/auth/asociados/update';

  constructor(private http: HttpClient) {}
  
  updatePermiso(id: number, permisosData: any): Observable<any> {
    return this.http.put(`${this.apiUrlformasContacto}/update`, { id, ...permisosData }).pipe(
      catchError(this.handleError)
    );
  }

  updatePermisoHabeasData(idAsociado: string, idPersona: string, habeasDataAceptado: boolean, categoria: string, fotoAsociado?: string): Observable<any> {
    const body = {
      id: idAsociado,
      fotoAsociado: fotoAsociado,
      persona: idPersona,
      categoria: categoria,  
      habeasData: habeasDataAceptado ? 1 : 0
    };
  
    return this.http.put(`${this.apiUrlHabeasData}`, body).pipe(
      catchError(this.handleError)
    );
  }

  
  updateFotoAsociado(idAsociado: string, idPersona: string, habeasDataAceptado: string, categoria: string, fotoAsociado?: string): Observable<any> {
    const body = {
      id: idAsociado,
      fotoAsociado: fotoAsociado,
      persona: idPersona,
      categoria: categoria,  
      habeasData: habeasDataAceptado
    };
  
    return this.http.put(`${this.apiUrlHabeasData}`, body).pipe(
      catchError(this.handleError)
    );
  }
  

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Error del servidor: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
