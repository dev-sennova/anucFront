import { Component, OnInit } from '@angular/core';
import { GruposService } from 'src/app/services/grupos.service';
import { CalculodecostosService } from 'src/app/services/calculodecostos.service';
import { UnidadesMedidaService } from 'src/app/services/unidades-medida.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
selector: 'app-categoria',
templateUrl: './categoria.component.html',
styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
// Variables
productos: any[] = [];
asociadoId: string = '1'; // Suponiendo que estás buscando el asociado con ID 1
constructor(
private GruposService: GruposService,
private unidadesService: UnidadesMedidaService,
private calculoDeCostosService: CalculodecostosService,
private router: Router
) { }

ngOnInit(): void {
this.cargarProductos();
}

cargarProductos(): void {
this.calculoDeCostosService.getInfoOneAsociadoProductos(this.asociadoId).subscribe(
(data) => {
console.log('Respuesta de la API (productos):', data); // Verifica la estructura de los datos
if (data && Array.isArray(data)) {
this.productos = data; // Almacena la lista completa de productos
} else {
console.error('No se encontraron productos en la respuesta');
}
},
(error) => {
console.error('Error al obtener los productos', error);
Swal.fire('Error', 'No se pudieron cargar los productos del asociado.', 'error');
}
);
}
}
