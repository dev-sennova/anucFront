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
  formulario = {
    //Huevos
    cantidadGallinas: 0,
    cantidadHuevosProducir: 0,
    //Cultivo
    cantidadHectarias: 0,
    cantidadProducir: 0,
    //Criadero
    cantidadCrias: 0,
    cantidadEsperadaProducir: 0,
    //Transformados
    cantidadTransformados: 0,
    cantidadTransformadosProducir: 0,
  
  };

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

  openModal(categoria: any) {
    this.selectedCategory = categoria;
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
  

  guardarDatos() {
    let errores = [];
  
    // Convertir a string y eliminar espacios en blanco solo si el valor es de tipo string
    const productoSeleccionado = typeof this.productoSeleccionado === 'string' ? this.productoSeleccionado.trim() : this.productoSeleccionado;
    const medidaSeleccionada = typeof this.medidaSeleccionada === 'string' ? this.medidaSeleccionada.trim() : this.medidaSeleccionada;
  
    // Validaciones generales (todos los campos son obligatorios)
    if (!this.fechaSeleccionada) errores.push('Fecha');
    if (!productoSeleccionado) errores.push('Producto');
    if (!medidaSeleccionada) errores.push('Medida');
  
    // Validaciones específicas para cada categoría (todos los campos son obligatorios)
    switch (this.selectedCategory.grupo) {
      case 'Huevos':
        if (this.formulario.cantidadGallinas <= 0 || this.formulario.cantidadGallinas === null) 
          errores.push('Cantidad de Gallinas');
        if (this.formulario.cantidadHuevosProducir <= 0 || this.formulario.cantidadHuevosProducir === null) 
          errores.push('Cantidad de Huevos a Producir');
        break;
  
      case 'Cultivos':
        if (this.formulario.cantidadHectarias <= 0 || this.formulario.cantidadHectarias === null) 
          errores.push('Cantidad de Hectáreas');
        if (this.formulario.cantidadProducir <= 0 || this.formulario.cantidadProducir === null) 
          errores.push('Cantidad a Producir');
        break;
  
      case 'Carnes':
        if (this.formulario.cantidadCrias <= 0 || this.formulario.cantidadCrias === null) 
          errores.push('Cantidad de Crías');
        if (this.formulario.cantidadEsperadaProducir <= 0 || this.formulario.cantidadEsperadaProducir === null) 
          errores.push('Cantidad Esperada a Producir');
        break;
  
      case 'Transformados':
        if (this.formulario.cantidadTransformados <= 0 || this.formulario.cantidadTransformados === null) 
          errores.push('Cantidad de Transformados');
        if (this.formulario.cantidadTransformadosProducir <= 0 || this.formulario.cantidadTransformadosProducir === null) 
          errores.push('Cantidad Esperada a Producir');
        break;
  
      // Si no es ninguna categoría específica, mostrar error
      default:
        break;
    }
  
    // Si hay errores, mostramos un mensaje con los campos faltantes
    if (errores.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, complete los siguientes campos: ' + errores.join(', '),
        confirmButtonText: 'Entendido'
      });
      return;
    }
  
    // Si no hay errores, preparar los datos para guardar
    let datosFormulario = {
      fecha: this.fechaSeleccionada,
      producto: productoSeleccionado,
      medida: medidaSeleccionada,
      cantidadGallinas: this.formulario.cantidadGallinas,
      cantidadHuevosProducir: this.formulario.cantidadHuevosProducir,
      cantidadHectarias: this.formulario.cantidadHectarias,
      cantidadProducir: this.formulario.cantidadProducir,
      cantidadCrias: this.formulario.cantidadCrias,
      cantidadEsperadaProducir: this.formulario.cantidadEsperadaProducir,
      cantidadTransformados: this.formulario.cantidadTransformados,
      cantidadTransformadosProducir: this.formulario.cantidadTransformadosProducir
    };
  
    // Mostrar los datos del formulario en la consola (opcional)
    console.log('Datos del formulario:', datosFormulario);
    const idCategoria = this.selectedCategory?.id;
    let idAsociado = localStorage.getItem('identificador_asociado') || '';
    let idAsociadoNum: number = Number(idAsociado);
    idAsociado = idAsociadoNum.toString();
    console.log('Datos a enviar:', { datosFormulario, idCategoria, idAsociado });
    this.calculoDeCostosService.guardarHojaGrupo(datosFormulario, idCategoria, idAsociado).subscribe(
      (respuesta) => {
        console.log('Datos guardados correctamente:', respuesta);
        Swal.fire('Éxito', 'Datos guardados correctamente.', 'success');
        this.closeModal(); // Cerrar modal tras guardado exitoso
      },
      (error) => {
        console.error('Error al guardar datos:', error);
        Swal.fire('Error', 'No se pudo guardar la información. Intente nuevamente.', 'error');
      }
    );

    
  }
  
  
}

