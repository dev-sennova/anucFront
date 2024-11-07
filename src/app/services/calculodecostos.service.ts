import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from '../commons/global-constants';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CalculodecostosService {
  private apiUrl = GlobalConstants.apiURL + `/api/auth/grupo_categorias/selectgrupo_categorias/`;
  private api = GlobalConstants.apiURL + '/api/auth/categoria/selectcategoria/';
  private apU= GlobalConstants.apiURL +'/api/auth/fases_produccion/selectfases_produccion/';
  private GrupoconceptosApi = GlobalConstants.apiURL + '/api/auth/grupos_conceptos/selectgrupos_conceptos/{id}';
  private Grupoconceptos = GlobalConstants.apiURL + '/api/auth/grupos_conceptos';
  private conceptosApi = GlobalConstants.apiURL + '/api/auth/conceptos/'
  
  constructor(private http: HttpClient) { }
  obtenerProductosPorCategoria(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}`).pipe(
      map(response => response.grupo_categorias)
    );
  }
  // Obtener todas las categorías
  getCategorias(): Observable<any> {
    return this.http.get<any>(`${this.api}/selectcategoria`);
  }

  // Obtener una categoría por ID
  getCategoriaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/selectcategoria/${id}`);
  }

  obtenerFases(): Observable<any> {
    return this.http.get(`${this.apU}index`);
  }

  // Obtener fases de producción por idGrupo
  obtenerFasesPorGrupo(id: number): Observable<any> {
    return this.http.get(`${this.apU}indexOne`, {
      params: { id: id.toString() }
    });
  }

  // Crear una nueva fase de producción
  crearFase(fase: any): Observable<any> {
    return this.http.post(`${this.apU}store`, fase);
  }

  // Actualizar una fase de producción
  actualizarFase(id: number, fase: any): Observable<any> {
    return this.http.put(`${this.apU}update`, { id, ...fase });
  }

  // Desactivar una fase de producción
  desactivarFase(id: number): Observable<any> {
    return this.http.put(`${this.apU}deactivate`, { id });
  }

  // Activar una fase de producción
  activarFase(id: number): Observable<any> {
    return this.http.put(`${this.apU}activate`, { id });
  }

  // Grupo de conceptos
  obtenerGruposConceptosPorFase(idFase: number): Observable<any> {
    return this.http.get<any>(`${this.GrupoconceptosApi}`, {
      params: { id: idFase }
    }).pipe(
      map(response => response.grupos_conceptos),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener grupo de conceptos por fase', error);
        return throwError(error);
      })
    );
  }

  // Concepto
  crearConcepto(fase: any): Observable<any> {
    return this.http.post(`${this.conceptosApi}store`, fase);
  }

  actualizarConcepto(id: number, concepto: any): Observable<any> {
    return this.http.put(`${this.conceptosApi}update`, { id, ...concepto });
  }

  desactivarConcepto(id: number): Observable<any> {
    return this.http.put(`${this.conceptosApi}deactivate`, { id });
  }

  activarConcepto(id: number): Observable<any> {
    return this.http.put(`${this.conceptosApi}activate`, { id });
  }

  getGruposConceptos(): Observable<any> {
    return this.http.get<any>(`${this.Grupoconceptos}`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerConceptoPorGrupo(id: number): Observable<any> {
    return this.http.get(`${this.conceptosApi}indexOneGrupo`, {
      params: { id: id.toString() }
    });
  }

  obtenerConceptosPorFase(idFase: number): Observable<any> {
    return this.http.get(`${this.conceptosApi}indexByFase`, {
      params: { idFase: idFase.toString() }
    });
}  

obtenerConceptos(): Observable<any> {
    return this.http.get<any>(this.conceptosApi).pipe(
      catchError(this.handleError)
    );
  }

  
  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    Swal.fire('Error', errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }
}
