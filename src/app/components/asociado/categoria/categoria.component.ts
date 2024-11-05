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
  mostrarContenido: boolean = false;
  gruposF: any[] = []; 
  categoriaId: number; 

  iconosFase1 = [
    'assets/iconos/fase1-1_icon.png',
    'assets/iconos/fase1-2_icon.png',
    'assets/iconos/fase1-3_icon.png',
    'assets/iconos/fase1-4_icon.png',
    'assets/iconos/fase1-5_icon.png',
    'assets/iconos/fase1-6_icon.png',
    'assets/iconos/fase1-7_icon.png' 
  ];
  
  iconosFase2 = [
    'assets/iconos/fase2-1_icon.png',
    'assets/iconos/fase2-2_icon.png',
    'assets/iconos/fase2-3_icon.png',
    'assets/iconos/fase2-4_icon.png',
    'assets/iconos/fase2-5_icon.png',
    'assets/iconos/fase2-6_icon.png',
    'assets/iconos/fase2-7_icon.png',
    'assets/iconos/fase2-8_icon.png'
  ];
  
  iconosFase3 = [
    'assets/iconos/fase3-1_icon.png',
    'assets/iconos/fase3-2_icon.png',
    'assets/iconos/fase3-3_icon.png',
    'assets/iconos/fase3-4_icon.png',
    'assets/iconos/fase3-5_icon.png',
    'assets/iconos/fase3-6_icon.png',
    'assets/iconos/fase3-7_icon.png'
  ];
  constructor(
    private GruposService: GruposService,
    private unidadesService: UnidadesMedidaService,
    private calculoDeCostosService: CalculodecostosService,
    private router: Router
  ) {this.categoriaId = parseInt(localStorage.getItem('categoriaId') || '0', 10);}

  ngOnInit(): void {
    this.obtenerGrupos();
    this.obtenerFasesPorGrupo();
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
  obtenerFasesPorGrupo(): void {
    this.calculoDeCostosService.obtenerFasesPorGrupo(this.categoriaId).subscribe({
      next: (data) => {
        data.fases_produccion.forEach((fase: any) => console.log('Fase:', fase));
        this.gruposF = this.groupFasesByProceso(data.fases_produccion);
      },
      error: (err) => {
        console.error('Error fetching phases', err);
      }
    });
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

    // Verificar si el campo 'descripcion' está vacío
    if (!this.formulario.descripcion || this.formulario.descripcion.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Campo descripción requerido',
        text: 'Debes llenar el campo de descripción antes de continuar',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.isModalOpen = true;
      });
      return;
    }

    // Verificar otros campos según la categoría seleccionada
    if (!this.camposCompletos()) {
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
        icon:'success',
        title: 'Datos guardados',
        text: 'Los datos se han guardado correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.mostrarContenido = true;
        this.isModalOpen = false;
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
  verFasesCostos(): void {
    this.mostrarContenido = true;
    this.isModalOpen = false;
  }


  ocultarFasesCostos(): void {
    this.mostrarContenido = false;
    this.isModalOpen = true; 
  }

  groupFasesByProceso(fases: any[]): any[] {
    const gruposF: any[] = []; 
    fases.forEach((fase, index) => {
      const procesoIndex = gruposF.findIndex(grupo => grupo.idGrupo === fase.idGrupo);
      const iconos = this.asignarIconos(fase.idGrupo);
      const icono = iconos[index % iconos.length]; 

      if (procesoIndex === -1) {
        gruposF.push({ idGrupo: fase.idGrupo, fases: [{ ...fase, icono }] });
      } else {
        gruposF[procesoIndex].fases.push({ ...fase, icono });
      }
    });
    return gruposF;
}
asignarIconos(idGrupo: number): string[] {
    switch (idGrupo) {
      case 1:
        return this.iconosFase1;
      case 2:
        return this.iconosFase2;
      case 3:
        return this.iconosFase3;
      default:
        return [];
    }
}
verDetalleFase(id: number): void {
  this.router.navigate(['/asociado/fases-costos', id]); 
}

}

