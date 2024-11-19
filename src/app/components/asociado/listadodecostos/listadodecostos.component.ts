import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalculodecostosService } from 'src/app/services/calculodecostos.service';
import { UnidadesMedidaService } from 'src/app/services/unidades-medida.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
selector: 'app-listadodecostos',
templateUrl: './listadodecostos.component.html',
styleUrls: ['./listadodecostos.component.css']
})
export class ListadodecostosComponent implements OnInit {
idGrupo?: string | null = null;
costos: any[] = [];
showFormularioProduccion: boolean = false; // Variable para mostrar el formulario
filteredProductos: any[] = []; // Productos filtrados
productos: any[] = []; // Declaramos la propiedad productos
productoSeleccionado: string | number = '';
medidas: any[] = [];
medidaSeleccionada: string | number = '';
respuestasFormulario: any = {
idProducto: '',
idAsociado: '',
descripcion: '',
unidad: '',
cantidad: '',
fechaInicio: '',
fechaFin: '',
esperado: ''
};
pregunta_1: string = '';
pregunta_2: string = '';
pregunta_3: string = '';
pregunta_4: string = '';
pregunta_5: string = '';
pregunta_6: string = '';

selectedCosto: any = null;
idHojaCostos: any;

showFiltro: boolean = false;
filtroProducto: string | null = null;
filtroFechaInicio: string | null = null;
filtroFechaFin: string | null = null;

constructor(
private route: ActivatedRoute,
private calculoDeCostosService: CalculodecostosService,
private unidadesService: UnidadesMedidaService,
private router: Router
) {}

ngOnInit(): void {
console.log('Ruta actual:', this.route.snapshot.url);

this.route.paramMap.subscribe(params => {
if (params.has('idGrupo')) {
this.idGrupo = params.get('idGrupo');
console.log('ID del grupo recibido:', this.idGrupo);

if (!this.idGrupo) {
console.error('No se encontró el ID del grupo en la ruta');
Swal.fire('Error', 'No se encontró el ID del grupo en la ruta.', 'error');
} else {
// Cargar datos cuando tenemos el ID del grupo
this.cargarLabels(this.idGrupo);
this.loadData();
}
} else {
console.error('La ruta no contiene el parámetro idGrupo');
Swal.fire('Error', 'La ruta no contiene el parámetro idGrupo.', 'error');
}
});

const idAsociado = localStorage.getItem('identificador_asociado');
console.log("ID del Asociado recibido ", idAsociado);
if (idAsociado) {
this.cargarProductos(idAsociado);
} else {
console.error('No se encontró el idAsociado en el localStorage');
}

this.cargarUnidades();
}

loadData() {
if (!this.idGrupo) {
console.error('No se puede cargar datos sin ID del grupo');
return;
}
this.calculoDeCostosService.getCostosDatos(Number(this.idGrupo)).subscribe(
(data) => {
console.log('Datos de costos:', data);
if (data && Array.isArray(data.hojas_por_grupo)) {
this.costos = data.hojas_por_grupo;
} else {
console.error('No se encontraron datos de costos');
this.costos = [];
}
},
(error) => {
console.error('Error al cargar costos:', error);
Swal.fire('Error', 'No se pudieron cargar los costos del grupo.', 'error');
}
);
}
cargarProductos(idAsociado: string): void {
this.calculoDeCostosService.getProductosPorAsociado(idAsociado).subscribe(
(data) => {
console.log('Datos de productos:', data);
if (data && Array.isArray(data.productos)) {
this.productos = data.productos;
this.filteredProductos = [...this.productos];
this.filterByCategory();
} else {
console.error('No se encontraron productos');
this.productos = [];
this.filteredProductos = [];
}
},
(error) => {
Swal.fire('Error', 'No se pudieron cargar los productos del asociado.', 'error');
}
);
}

cargarLabels(idGrupo: string): void {
this.calculoDeCostosService.getLabelsModal(idGrupo).subscribe(
(data) => {
console.log('Labels:', data);
if (data && Array.isArray(data.generalidades_produccion)) {
this.pregunta_1 = data.generalidades_produccion[0].pregunta_1;
this.pregunta_2 = data.generalidades_produccion[0].pregunta_2;
this.pregunta_3 = data.generalidades_produccion[0].pregunta_3;
this.pregunta_4 = data.generalidades_produccion[0].pregunta_4;
this.pregunta_5 = data.generalidades_produccion[0].pregunta_5;
this.pregunta_6 = data.generalidades_produccion[0].pregunta_6;
} else {
console.error('No se encontraron labels');
}
}
);
}

filterByCategory(): void {
console.log('Filtrando por categoría:', this.idGrupo);
if (this.idGrupo) {
this.filteredProductos = this.productos.filter(product => product.idGrupo == this.idGrupo);
console.log('Productos filtrados:', this.filteredProductos);
}
}

cargarUnidades(): void {
this.unidadesService.getUnidades().subscribe(
(data) => {
this.medidas = data;
},
(error) => {
Swal.fire('Error', 'No se pudieron cargar las unidades de medida.', 'error');
}
);
}

openFormulario(): void {
console.log("Abriendo formulario de producción...");
this.showFormularioProduccion = true;
}

closeFormularioProduccion(): void {
this.showFormularioProduccion = false;
}

submitFormulario(): void {
this.respuestasFormulario.idProducto = this.productoSeleccionado;
this.respuestasFormulario.idAsociado = localStorage.getItem('identificador_asociado');

if (!Object.keys(this.respuestasFormulario).every(campo =>
this.respuestasFormulario[campo] !== null &&
this.respuestasFormulario[campo] !== undefined &&
this.respuestasFormulario[campo].toString().trim() !== ''
)) {
Swal.fire('Advertencia', 'Todos los campos deben estar llenos antes de guardar.', 'warning');
return;
}

console.log("Formulario enviado con los siguientes datos:", this.respuestasFormulario);

this.calculoDeCostosService.getCostosDatos(Number(this.idGrupo)).subscribe(
(data) => {
console.log('Datos de costos:', data);
if (data && Array.isArray(data)) {
this.costos = data;
} else {
console.error('No se encontraron datos de costos');
this.costos = [];
}
},
(error) => {
Swal.fire('Error', 'No se pudieron cargar los costos del grupo.', 'error');
}
);

this.calculoDeCostosService.submitFormularioProduccion(this.respuestasFormulario).subscribe(
(response) => {
console.log('Formulario enviado con éxito', response);
Swal.fire('Éxito', 'Formulario enviado correctamente', 'success');
this.closeFormularioProduccion();
this.loadData();
},
(error) => {
console.error('Error al enviar el formulario', error);
Swal.fire('Error', 'No se pudo enviar el formulario', 'error');
}
);
}

verCosto(idHoja: any): void {
this.idHojaCostos = idHoja;
this.router.navigate(['/asociado/fases-costos/'+ this.idGrupo + '/' + this.idHojaCostos]);
}

toggleFiltro(): void {
this.showFiltro = !this.showFiltro;
}


filtrarCostos(): void {
    let costosFiltrados = [...this.costos];
    // Filtrar por producto si se seleccionó
    if (this.filtroProducto) {
      costosFiltrados = costosFiltrados.filter(costo => costo.producto === this.filtroProducto);
      console.log("Producto filtrado: ", this.filtroProducto);
      console.log("Costos después del filtro de producto: ", costosFiltrados);
    }
  
    // Filtrar por rango de fechas si se proporcionaron
    if (this.filtroFechaInicio) {
      const fechaInicio = new Date(this.filtroFechaInicio);
      costosFiltrados = costosFiltrados.filter(costo => new Date(costo.fechaInicio) >= fechaInicio);
    }
    if (this.filtroFechaFin) {
      const fechaFin = new Date(this.filtroFechaFin);
      costosFiltrados = costosFiltrados.filter(costo => new Date(costo.fechaFin) <= fechaFin);
    }
  
    console.log('Costos Filtrados:', costosFiltrados);
    this.costos = costosFiltrados;
  }
  

}

