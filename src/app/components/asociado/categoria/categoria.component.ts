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
  productos: any[] = []; // Para que me filtre los productos
  idAsociado: string = "";
  bloqcat: any[] = []; // Para que me guarde las categorias
  fechaSeleccionada: string = '';  // Para el selector de fecha
  productoSeleccionado: string | number = ''; // Para el selector de productos
muestrasProd: any[] = []; // Declarar el arreglo donde se almacenarán los productos filtrados
  selectedCategory: any = null;

  constructor(
    private GruposService: GruposService,
    private unidadesService: UnidadesMedidaService,
    private calculoDeCostosService: CalculodecostosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let idAsociado = localStorage.getItem('identificador_asociado') || '';
    console.log('idAsociado obtenido:', idAsociado);
    let idAsociadoNum: number = Number(idAsociado);
    idAsociado = idAsociadoNum.toString();

    if (idAsociado) {
      // Cargar productos y categorías al inicializar
      this.cargarProductos(idAsociado);
      this.cargarCategorias(idAsociado);
    } else {
      console.error('No se encontró idAsociado en el localStorage');
    }
  }

  // Método para cargar productos según la categoría seleccionada
  cargarProductos(idAsociado: string): void {
    const idCategoria = this.selectedCategory;  // ID de la categoría seleccionada

    console.log('Categoría seleccionada ID:', idCategoria); // Verificar la categoría seleccionada

    if (idCategoria) {
      // Si hay una categoría seleccionada, hacer la consulta de productos filtrados por categoría
      this.calculoDeCostosService.getProductosPorAsociadoYCategoria(idAsociado, idCategoria).subscribe(
        (data) => {
          console.log('Respuesta de la API (productos filtrados por categoría):', data);
          if (data && Array.isArray(data.productos)) {
            this.productos = data.productos; // Almacenar productos filtrados
          } else {
            console.error('No se encontraron productos filtrados por categoría');
            this.productos = []; // Vaciar lista si no hay productos
          }
        },
        (error) => {
          console.error('Error al obtener los productos filtrados', error);
          Swal.fire('Error', 'No se pudieron cargar los productos del asociado en la categoría seleccionada.', 'error');
        }
      );
    } else {
      // Si no se ha seleccionado una categoría, obtener todos los productos
      this.calculoDeCostosService.getProductosPorAsociado(idAsociado).subscribe(
        (data) => {
          console.log('Respuesta de la API (todos los productos):', data);
          if (data && Array.isArray(data.productos)) {
            this.productos = data.productos; // Almacenar todos los productos
          } else {
            console.error('No se encontraron productos');
            this.productos = []; // Vaciar lista si no hay productos
          }
        },
        (error) => {
          console.error('Error al obtener los productos', error);
          Swal.fire('Error', 'No se pudieron cargar los productos del asociado.', 'error');
        }
      );
    }
  }

  // Método para cargar las categorías del usuario
  cargarCategorias(idAsociado: string): void {
    this.calculoDeCostosService.getCategoriasPorUsuario(idAsociado).subscribe(
      (data) => {
        console.log('Respuesta de la API (categorías):', data);
        
        // Verificamos que la respuesta tenga la propiedad 'categorias' y que sea un arreglo
        if (data && data.categorias && Array.isArray(data.categorias)) {
          this.bloqcat = data.categorias;
          console.log('Categorías cargadas en bloqcat:', this.bloqcat);
        } else {
          console.error('No se encontraron categorías en la respuesta');
          Swal.fire('Error', 'No se pudieron cargar las categorías del usuario.', 'error');
        }
      },
      (error) => {
        console.error('Error al obtener las categorías', error);
        Swal.fire('Error', 'No se pudieron cargar las categorías del asociado.', 'error');
      }
    );
  }

  // Método para obtener el icono de cada categoría
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
    this.muestrasProd = []; // Asegúrate de inicializar el arreglo antes de llenarlo
  
    for (let cont = 0; cont < this.productos.length; cont++) {
      // Variable temporal para almacenar el grupo del producto actual
      let lecturaGr = this.productos[cont].grupo;
      
      // Verificar si el grupo coincide con la categoría seleccionada
      if (lecturaGr === this.selectedCategory.grupo) {
        // Si coincide, agregar el producto al arreglo muestrasProd
        this.muestrasProd.push(this.productos[cont].producto);
      }
    }
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
