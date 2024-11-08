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
private apiUrlInfoAsociados = GlobalConstants.apiURL + '/api/auth/asociados/detallado';
private categoriaUsuario =  GlobalConstants.apiURL + '/api/auth/costeo/categorias_usuario/';
private categoriaProducto = GlobalConstants.apiURL + '/api/auth//costeo/productos_usuario/';

constructor(private http: HttpClient) { }

// Función genérica para obtener datos del asociado
private getAsociadoData(id: string): Observable<any> {
const url = `${this.apiUrlInfoAsociados}/${id}`;
return this.http.get<any>(url).pipe(
catchError(this.handleError)
);
}

getInfoOneAsociado(id: string): Observable<any> {
const url = `${this.apiUrlInfoAsociados}/${id}`;
return this.http.get<any>(url).pipe(
catchError(this.handleError)
);
}
// Función para obtener los productos del asociado
getInfoOneAsociadoProductos(id: string): Observable<any> {
const url = `${this.apiUrlInfoAsociados}/${id}`;
return this.http.get<any>(url).pipe(
map(response => response.produccion), // Extrae correctamente los productos
catchError(this.handleError)
);
}
getAsociado(): Observable<any> {
return this.http.get<any>(this.apiUrlInfoAsociados);
}

// Función para obtener los familiares del asociado
getInfoOneFamiliares(id: string): Observable<any> {
return this.getAsociadoData(id).pipe(
map(response => response.familiares), // Filtramos la información de familiares
catchError(this.handleError)
);
}

// Función para obtener la información general del asociado
getInfoAsociado(id: string): Observable<any> {
return this.getAsociadoData(id).pipe(
map(response => response),
catchError(this.handleError)
);
}

// Función para obtener las categorías de un usuario específico
getCategoriasPorUsuario(id: string): Observable<any> {
    const url = `${this.categoriaUsuario}${id}`;
    return this.http.get<any>(url).pipe(
    catchError(this.handleError)
    );
}

// CalculodecostosService
getProductosPorUsuario(id: string): Observable<any> {
    const url = `${this.apiUrlInfoAsociados}/costeo/productos_usuario/${id}`;
    return this.http.get<any>(url).pipe(
    catchError(this.handleError)
    );
}

// CalculodecostosService
getProductosPorCategoria(idAsociado: string, idCategoria: string): Observable<any> {
    const url = `${this.apiUrlInfoAsociados}/costeo/productos_usuario/${idAsociado}?categoria=${idCategoria}`;
    return this.http.get<any>(url).pipe(
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

