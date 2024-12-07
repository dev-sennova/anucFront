import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalConstants } from '../commons/global-constants';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProductosCategoriasService {

  private apiUrlProductos = GlobalConstants.apiURL + '/api/auth/producto';
  private apiUrlCategorias = GlobalConstants.apiURL + '/api/auth/categoria';
  private apiUrlGrupos = GlobalConstants.apiURL + '/api/auth/grupos';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<any> {
    return this.http.get<any>(this.apiUrlProductos).pipe(
      map(response => response.productos),
      catchError(this.handleError)
    );
  }

  getOneProducto(idProducto:any): Observable<any> {
    const url = `${this.apiUrlProductos}/imagenproducto/${idProducto}`;
    return this.http.get<any>(url).pipe(
      map(response => response.productos[0].imagenProducto),
      catchError(this.handleError)
    );
  }


  addProducto(producto: any): Observable<any> {
    const url = `${this.apiUrlProductos}/store`;
    return this.http.post<any>(url, producto).pipe(
      catchError(this.handleError)
    );
  }

  updateProducto(producto: any): Observable<any> {
    const url = `${this.apiUrlProductos}/update`;
    return this.http.put<any>(url, producto).pipe(
      catchError(this.handleError)
    );
  }

  activateProducto(id: string): Observable<any> {
    const url = `${this.apiUrlProductos}/activate`;
    return this.http.put<any>(url, { id }).pipe(
      catchError(this.handleError)
    );
  }

  deactivateProducto(id: string): Observable<any> {
    const url = `${this.apiUrlProductos}/deactivate`;
    return this.http.put<any>(url, { id }).pipe(
      catchError(this.handleError)
    );
  }

  getCategorias(): Observable<any> {
    return this.http.get<any>(this.apiUrlCategorias).pipe(
      map(response => {
        if (response.estado === 'Ok') {
          return response.producto_categorias;
        } else {
          throw new Error('Error en la respuesta del servicio: ' + response.estado);
        }
      }),
      catchError(this.handleError)
    );
  }

  getGrupos(): Observable<any> {
    return this.http.get<any>(this.apiUrlGrupos).pipe(
      map(response => {
        if (response.estado === 'Ok') {
          return response.grupos;
        } else {
          throw new Error('Error en la respuesta del servicio: ' + response.estado);
        }
      }),
      catchError(this.handleError)
    );
  }

  addCategoria(categoria: any): Observable<any> {
    const url = `${this.apiUrlCategorias}/store`;
    return this.http.post<any>(url, categoria).pipe(
      catchError(this.handleError)
    );
  }

  updateCategoria(categoria: any): Observable<any> {
    const url = `${this.apiUrlCategorias}/update`;
    return this.http.put<any>(url, categoria).pipe(
      catchError(this.handleError)
    );
  }

  activateCategoria(id: string): Observable<any> {
    const url = `${this.apiUrlCategorias}/activate`;
    return this.http.put<any>(url, { id }).pipe(
      catchError(this.handleError)
    );
  }

  deactivateCategoria(id: string): Observable<any> {
    const url = `${this.apiUrlCategorias}/deactivate`;
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
