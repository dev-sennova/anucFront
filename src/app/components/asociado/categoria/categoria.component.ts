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
  grupos: any;
  categoriaSeleccionada: any = null;
  formulario = {
    producto: '',
    medida: '',
    cantidadGallinas: 0,
    cantidadHuevosProducir: 0,
    cantidadHectarias: 0,
    cantidadProducir: 0,
    cantidadCrias: 0,
    cantidadEsperadaProducir: 0,
    cantidadTransformados: 0,
    descripcion: '',
  };

  productos: any[] = [];
  medidas: any[] = [];
  isModalOpen: boolean = false;

  constructor(
    private GruposService: GruposService,
    private unidadesService: UnidadesMedidaService,
    private calculoDeCostosService: CalculodecostosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerGrupos();
  }

  obtenerGrupos(): void {
    this.GruposService.getGrupos().subscribe(
      (response) => {
        if (response.estado === 'Ok' && response.grupo && Array.isArray(response.grupo)) {
          this.grupos = response.grupo.filter((grupo: any) => grupo.grupo !== 'Transformados'); 
        }
      },
      (error) => {
        console.error('Error al obtener los grupos:', error);
      }
    );
  }

  seleccionarCategoria(grupo: any): void {
    this.categoriaSeleccionada = grupo;
    this.cargarProductos();
    this.cargarMedidas();
    this.isModalOpen = true;
    this.inicializarFormulario(); 
  }

  inicializarFormulario(): void {
    this.formulario = {
      producto: '',
      medida: '',
      cantidadGallinas: 0, // Inicializado a 0
      cantidadHuevosProducir: 0, // Inicializado a 0
      cantidadHectarias: 0,
      cantidadProducir: 0,
      cantidadCrias: 0,
      cantidadEsperadaProducir: 0,
      cantidadTransformados: 0,
      descripcion: '',
    };

    if (!this.categoriaSeleccionada || !this.categoriaSeleccionada.grupo) {
      console.error('Categoría no seleccionada o no válida');
      return;
    }

    switch (this.categoriaSeleccionada.grupo) {
      case 'Huevos':
        this.formulario.cantidadGallinas = 0; 
        this.formulario.cantidadHuevosProducir = 0;
        break;
      case 'Cultivos':
        this.formulario.cantidadHectarias = 0;
        this.formulario.cantidadProducir = 0;
        break;
      case 'Carnes':
        this.formulario.cantidadCrias = 0;
        this.formulario.cantidadEsperadaProducir = 0;
        break;
      case 'Transformados':
        this.formulario.cantidadTransformados = 0;
        this.formulario.cantidadEsperadaProducir = 0;
        break;
    }
  }

  cargarProductos(): void {
    const id = this.categoriaSeleccionada.id;
    this.calculoDeCostosService.obtenerProductosPorCategoria(id).subscribe(
      (data) => {
        this.productos = data;
      },
      (error: any) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  cargarMedidas(): void {
    this.unidadesService.getUnidades().subscribe(
      (data) => {
        this.medidas = data;
      },
      (error: any) => {
        console.error('Error al obtener medidas:', error);
      }
    );
  }

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

  closeModal(): void {
    this.isModalOpen = false;
  }

  guardarFormulario(): void {
    this.categoriaSeleccionada = null;
    this.formulario = {
      producto: '',
      medida: '',
      cantidadGallinas: 0,
      cantidadHuevosProducir: 0,
      cantidadHectarias: 0,
      cantidadProducir: 0,
      cantidadCrias: 0,
      cantidadEsperadaProducir: 0,
      cantidadTransformados: 0,
      descripcion: ''
    }; 
  }

  // Validar que todos los campos requeridos están llenos
  camposCompletos(): boolean {
    return Object.values(this.formulario).every(campo => {
        return campo !== null && campo !== '' && !(typeof campo === 'number' && campo <= 0);
    });
}

  guardarYRedirigir(): void {
    if (!this.camposCompletos()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Debes llenar todos los campos antes de continuar',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.isModalOpen = true; // Mantiene el modal abierto
      });
      return;
    }

    // Si todos los campos están completos, guarda los datos
    this.saveFormData(this.formulario).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Datos guardados',
        text: 'Los datos se han guardado correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.closeModal(); // Cierra el modal después de guardar
        this.router.navigate(['/asociado/fases-costos']); // Redirige si es necesario
      });
    }).catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar los datos.',
        confirmButtonText: 'Aceptar'
      });
    });
  }

  // Simulación de la función para guardar datos
  private saveFormData(formData: any): Promise<void> {
    // Implementa aquí la lógica para guardar los datos
    return new Promise((resolve, reject) => {
      // Simulación de un retraso de red
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
}

