import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalculodecostosService } from 'src/app/services/calculodecostos.service';
import { UnidadesMedidaService } from 'src/app/services/unidades-medida.service';
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

  constructor(
    private route: ActivatedRoute,
    private calculoDeCostosService: CalculodecostosService,
    private unidadesService: UnidadesMedidaService,
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
          this.loadData();
        }
      } else {
        console.error('La ruta no contiene el parámetro idGrupo');
        Swal.fire('Error', 'La ruta no contiene el parámetro idGrupo.', 'error');
      }
    });

    const idAsociado = localStorage.getItem('identificador_asociado');
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

    console.log('Cargando datos para el ID:', this.idGrupo);
    
    // Simulación de llamado al servicio
    setTimeout(() => {
      console.log('Datos cargados con éxito');
      this.costos = []; // Simulando que no hay costos al principio
    }, 1000);
  }

  cargarProductos(idAsociado: string): void {
    this.calculoDeCostosService.getProductosPorAsociado(idAsociado).subscribe(
      (data) => {
        console.log('Datos de productos:', data);  // Verifica que los datos lleguen correctamente
        if (data && Array.isArray(data.productos)) {
          this.productos = data.productos;
          this.filteredProductos = [...this.productos]; // Asignar los productos a filteredProductos
          this.filterByCategory(); // Llamar a filterByCategory después de cargar los productos
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
  
  

  // Método para filtrar productos por categoría
  filterByCategory(): void {
    console.log('Filtrando por categoría:', this.idGrupo); // Verifica el valor de idGrupo
    if (this.idGrupo) {
      // Asegúrate de que idGrupo sea el tipo correcto
      this.filteredProductos = this.productos.filter(product => product.idGrupo == this.idGrupo);
      console.log('Productos filtrados:', this.filteredProductos); // Log para verificar el filtrado
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

  // Método para abrir el formulario
  openFormulario() {
    console.log("Abriendo formulario de producción...");
    this.showFormularioProduccion = true; // Hacemos que el formulario se muestre
  }

  // Método para cerrar el formulario
  closeFormularioProduccion(): void {
    this.showFormularioProduccion = false; // Hacemos que el formulario se oculte
  }

  // Método para manejar el envío del formulario
  submitFormulario() {
    // Aseguramos que el campo producto esté correctamente actualizado
    this.respuestasFormulario.idProducto = this.productoSeleccionado;
    this.respuestasFormulario.idAsociado = localStorage.getItem('identificador_asociado');

    // Validamos que todos los campos estén completos
    const camposCompletos = Object.keys(this.respuestasFormulario).every(campo => {
      const valor = this.respuestasFormulario[campo];
      return valor !== null && valor !== undefined && valor.toString().trim() !== '';
    });

    // Si falta algún campo, mostramos un mensaje y detenemos el envío
    if (!camposCompletos) {
      Swal.fire('Advertencia', 'Todos los campos deben estar llenos antes de guardar.', 'warning');
      return;
    }

    console.log("Formulario enviado con los siguientes datos:", this.respuestasFormulario);

    // Enviamos los datos del formulario al servicio
    this.calculoDeCostosService.submitFormularioProduccion(this.respuestasFormulario).subscribe(
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
}
