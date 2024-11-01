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
      cantidadGallinas: 0, 
      cantidadHuevosProducir: 0,
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

  camposCompletos(): boolean {
    const { cantidadCrias, cantidadEsperadaProducir, cantidadGallinas, cantidadHuevosProducir, cantidadHectarias, cantidadProducir, cantidadTransformados } = this.formulario;
    
    switch (this.categoriaSeleccionada.grupo) {
      case 'Huevos':
        return cantidadGallinas > 0 && cantidadHuevosProducir > 0;
      case 'Cultivos':
        return cantidadHectarias > 0 && cantidadProducir > 0;
      case 'Carnes':
        return cantidadCrias > 0 && cantidadEsperadaProducir > 0;
      case 'Transformados':
        return cantidadTransformados > 0 && cantidadEsperadaProducir > 0;
      default:
        return false;
    }
  }

  guardarYRedirigir(): void {
    console.log('Formulario:', this.formulario);
    if (!this.camposCompletos()) {
      console.log('Campos incompletos');
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Debes llenar todos los campos antes de continuar',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.isModalOpen = true;
      });
      return;
    }

    if (this.categoriaSeleccionada && this.categoriaSeleccionada.id) {
      localStorage.setItem('categoriaId', String(this.categoriaSeleccionada.id));
      Swal.fire({
        icon: 'success',
        title: 'Datos guardados',
        text: 'Los datos se han guardado correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.closeModal(); 
        this.router.navigate(['/asociado/fases-costos']);
      });
    } else {
      console.error('ID de categoría inválido');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al obtener el ID de la categoría.',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  private saveFormData(formData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Datos guardados:', formData);
        resolve();
      }, 1000); 
    });
  }
}
