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

  }