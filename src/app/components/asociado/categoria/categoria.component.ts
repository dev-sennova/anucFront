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

  productos: any[] = [];
  filteredProductos: any[] = [];
  idAsociado: string = "";
  bloqcat: any[] = [];
  fechaSeleccionada: string = '';
  productoSeleccionado: string | number = '';
  selectedCategory: any = null;
  medidas: any[] = []; 
  medidaSeleccionada: string | number = '';
  respuestasFormulario: any = {
    producto: '',
    descripcion: '',
    hectareas: '',
    fechaInicio: '',
    fechaFin: '',
    produccionEsperada: ''
  };
  showFormularioProduccion: boolean = false;

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

    this.cargarUnidades();
  }

  // Método para cargar productos según la categoría seleccionada
  cargarProductos(idAsociado: string): void {
    this.calculoDeCostosService.getProductosPorAsociado(idAsociado).subscribe(
      (data) => {
        console.log('Respuesta de la API (todos los productos):', data);
        if (data && Array.isArray(data.productos)) {
          this.productos = data.productos;
          this.filteredProductos = [...this.productos]; // Inicializa filteredProductos con todos los productos
          console.log('Productos cargados:', this.productos);
        } else {
          console.error('No se encontraron productos');
          this.productos = [];
          this.filteredProductos = [];
        }
      },
      (error) => {
        console.error('Error al obtener los productos', error);
        Swal.fire('Error', 'No se pudieron cargar los productos del asociado.', 'error');
      }
    );
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

  // Cargar las medidas 
  cargarUnidades(): void {
    this.unidadesService.getUnidades().subscribe(
      (data) => {
        console.log('Unidades de medida cargadas:', data);
        this.medidas = data;
      },
      (error) => {
        console.error('Error al cargar unidades de medida:', error);
        Swal.fire('Error', 'No se pudieron cargar las unidades de medida.', 'error');
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
  openFormularioProduccion(idGrupo: number) {
    this.showFormularioProduccion = true; // Muestra el formulario
    console.log("Formulario de producción abierto para el grupo ID:", idGrupo);
  }
  openModal(categoria: any) {
    this.selectedCategory = categoria;
  }

  closeFormularioProduccion(): void {
    this.showFormularioProduccion = false; // Cierra el formulario
  }

  submitFormulario() {
    // Obtenemos los datos del formulario
    const respuestas = this.respuestasFormulario;
    
    // Aseguramos que el campo producto esté correctamente actualizado
    respuestas.producto = this.productoSeleccionado;
  
    // Imprimimos los valores actuales para verificar que no haya datos inesperados
    console.log("Valores actuales en el formulario:", respuestas);
  
    // Validamos que todos los campos estén completos
    const camposCompletos = Object.keys(respuestas).every(campo => {
      const valor = respuestas[campo];
      return valor !== null && valor !== undefined && valor.toString().trim() !== '';
    });
  
    // Si falta algún campo, mostramos un mensaje y detenemos el envío
    if (!camposCompletos) {
      Swal.fire('Advertencia', 'Todos los campos deben estar llenos antes de guardar.', 'warning');
      return; // Detenemos el envío
    }
  
    console.log("Formulario enviado con los siguientes datos:", respuestas);
  
    // Verificamos que 'idGrupo' esté definido
    const idGrupo = this.selectedCategory ? this.selectedCategory.idGrupo : null;
    if (!idGrupo) {
      Swal.fire('Advertencia', 'Seleccione una categoría válida.', 'warning');
      return;
    }
  
    // Enviamos los datos del formulario al servicio
    this.calculoDeCostosService.submitFormularioProduccion(idGrupo, respuestas).subscribe(
      (response) => {
        console.log('Formulario enviado con éxito', response);
        Swal.fire('Éxito', 'Formulario enviado correctamente', 'success');
        this.closeFormularioProduccion(); // Cerramos el formulario después de enviar
      },
      (error) => {
        console.error('Error al enviar el formulario', error);
        Swal.fire('Error', 'No se pudo enviar el formulario', 'error');
      }
    );
  }
  
  

  closeModal(): void {
    this.selectedCategory = false;
  }
  // Método para filtrar productos según la categoría seleccionada
  filterByCategory(category: any): void {
    this.selectedCategory = category;
    
    // Asegúrate de que los productos estén cargados antes de aplicar el filtro
    if (this.productos.length > 0) {
      this.filteredProductos = this.productos.filter(product => product.idGrupo === category.idGrupo);
      console.log('Productos filtrados:', this.filteredProductos);
    } else {
      console.error('No hay productos cargados');
    }
  }
  
  addSpreadsheet() {
    console.log("Agregar Hoja de Cálculo ha sido presionado");
    // Aquí puedes agregar lógica adicional, como mostrar un formulario
  }

  
}

