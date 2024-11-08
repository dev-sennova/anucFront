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
productos: any[] = [];// Para que me filtre los productos
idAsociado: string="";
bloqcat: any[] = [];// Para que me guarde las categorias
fechaSeleccionada: string = '';  // Para el selector de fecha
productoSeleccionado: any = null; // Para el selector de productos


//asociadoId: string = '1'; // Suponiendo que estás buscando el asociado con ID 1
constructor(
private GruposService: GruposService,
private unidadesService: UnidadesMedidaService,
private calculoDeCostosService: CalculodecostosService,
private router: Router
) { }
selectedCategory: any = null;



ngOnInit(): void {
  let idAsociado = localStorage.getItem('identificador_asociado') || '';

  let idAsociadoNum: number = Number(idAsociado);
  idAsociado = idAsociadoNum.toString();

  if (idAsociado) {
    this.cargarProductos(idAsociado);
    this.cargarCategorias(idAsociado);
  } else {
    console.error('No se encontró idAsociado en el localStorage');
  }
}

// Guardar Productos
cargarProductos(idAsociado: string): void {
  
this.calculoDeCostosService.getInfoOneAsociadoProductos(idAsociado).subscribe(
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

// Guardar Categorias
cargarCategorias(idAsociado: string): void {
  this.calculoDeCostosService.getCategoriasPorUsuario(idAsociado).subscribe(
    (data) => {
      console.log('Respuesta de la API (categorías):', data);  // Verifica la estructura de los datos
      if (data && data.categorias && Array.isArray(data.categorias)) {
        this.bloqcat = data.categorias;
        console.log('Categorías cargadas en bloqcat:', this.bloqcat);  // Confirmar que bloqcat tiene los datos correctos
      } else {
        console.error('No se encontraron categorías en la respuesta');
      }
    },
    (error) => {
      console.error('Error al obtener las categorías', error);
      Swal.fire('Error', 'No se pudieron cargar las categorías del asociado.', 'error');
    }
  );
}

// Visualización de iconos categorias
getIconUrl(grupo: string): string {
  switch (grupo) {
    case 'Cultivos':
      return 'assets/iconos/cultivo_icon.png';
    case 'Huevos':
      return 'assets/iconos/carton-de-huevos_icon.png';
    case 'Carnes':
      return 'assets/iconos/carnes_icon.png';
    case 'Transformados':
      return 'assets/iconos/transformados_icon.png';
    default:
      return 'assets/iconos/transformados_icon.png';
  }
}

openModal(categoria: any) {
  this.selectedCategory = categoria;
}

closeModal(event?: MouseEvent) {
  if (event) {
    event.stopPropagation(); // Evita el cierre cuando se hace clic en el contenido del modal
  }
  this.selectedCategory = null;
}

guardarDatos() {
  const datosFormulario = {
    fecha: this.fechaSeleccionada,
    producto: this.productoSeleccionado
  };
  console.log('Datos del formulario:', datosFormulario);
  // Aquí puedes llamar al servicio para enviar los datos al backend
}
}