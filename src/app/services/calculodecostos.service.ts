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
private categoriaProducto = GlobalConstants.apiURL + '/api/auth/costeo/productos_usuario/';
private generalidad = GlobalConstants.apiURL + '/api/auth/generalidades_produccion/selectgeneralidades_produccion/';

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
    const url = `${this.categoriaProducto}/costeo/productos_usuario/${idAsociado}?categoria=${idCategoria}`;
    return this.http.get<any>(url).pipe(
    catchError(this.handleError)
    );
}

  // Método para obtener todos los productos por asociado
getProductosPorAsociado(idAsociado: string): Observable<any> {
    const url = `${this.categoriaProducto}${idAsociado}`; // Solo pasa el idAsociado
    return this.http.get<any>(url);
}

  // Método para obtener los productos por asociado y categoría (si se aplica)
getProductosPorAsociadoYCategoria(idAsociado: string, idCategoria: string): Observable<any> {
    const url = `${this.categoriaProducto}${idAsociado}/${idCategoria}`; // Añadir idCategoria en la URL
    return this.http.get<any>(url);
}

  // Método para obtener información de un producto específico (si es necesario)
getProductoPorId(idAsociado: string, idProducto: string): Observable<any> {
    const url = `${this.categoriaProducto}${idAsociado}/${idProducto}`;
    return this.http.get<any>(url);
}

// Método para obtener las categorías de productos de un asociado
getCategoriasPorProducto(idAsociado: string): Observable<any> {
    const url = `${this.categoriaProducto}${idAsociado}`;
    return this.http.get<any>(url).pipe(
      map(response => response.map((item: any) => ({
        id: item.idGrupo,
        nombre: item.grupo,
        descripcion: item.descripcionGrupo
      }))), // Mapea la respuesta a un formato más conveniente
      catchError(this.handleError)
    );
}

getGeneralidadesProduccion(): Observable<any> {
  return this.http.get<any>(`${this.generalidad}`).pipe(
    catchError(this.handleError)
  );
}


submitFormularioProduccion(idGrupo: number, respuestas: any): Observable<any> {
  const url = `${this.generalidad}`;
  const data = {
    idGrupo: idGrupo,
    respuestas: respuestas // Aquí agregas las respuestas del formulario
  };
  return this.http.post<any>(url, data).pipe(
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

