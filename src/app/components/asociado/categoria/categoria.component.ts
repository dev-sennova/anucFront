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

 //Fases Coceptos
  fases: any[] = [];
  faseSeleccionada: any = null;
  mostrarFormularioConcepto: boolean = false;
  formularioConcepto = {
    concepto: '',
    cantidad: 0,
    valorUnitario: 0
  };

 //Variables
  productos: any[] = [];
  medidas: any[] = [];
  isModalOpen: boolean = false;
  mostrarContenido: boolean = false;
  gruposF: any[] = []; 
  categoriaId: number = 0; 
  faseId: number = 0; 
  isModalOpenG: boolean = false;
  gruposConceptos: any[] = [];
  conceptos: any[] = [];


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
  ) {
    // Recupera la categoría seleccionada de localStorage
    this.categoriaId = parseInt(localStorage.getItem('categoriaId') || '0', 10);
  }

  ngOnInit(): void {
    this.obtenerGrupos();
    if (this.categoriaId) {
      this.obtenerFasesPorGrupo();
    }
    this.obtenerFases();
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
        console.log('Fases recuperadas:', data);
        this.gruposF = this.groupFasesByProceso(data.fases_produccion);
      },
      error: (err) => {
        console.error('Error al obtener fases', err);
      }
    });
  }
  

  obtenerFases(): void {
    // Método que llama al servicio para obtener las fases
    this.calculoDeCostosService.obtenerFases().subscribe(
      fases => {
        this.fases = fases;
      },
      error => console.error('Error al obtener fases:', error)
    );
  }


// Obtener la fase para que me muestre el grupo




  //Categoria
  seleccionarCategoria(grupo: any): void {
    this.categoriaSeleccionada = grupo;
    this.categoriaId = grupo.id;
    localStorage.setItem('categoriaId', String(this.categoriaId));
    this.obtenerFasesPorGrupo(); // Recarga las fases según la nueva categoría seleccionada
    this.cargarProductos();
    this.cargarMedidas();
    this.isModalOpen = true;
    this.inicializarFormulario();
    this.inicializarFormularioFase();
  }

  //Fases
  seleccionarFase(fase: any): void {
    console.log('Fase seleccionada:', fase);
    this.faseSeleccionada = fase;
    this.mostrarFormularioConcepto = true;  // Activa el formulario de concepto
    console.log('mostrarFormularioConcepto:', this.mostrarFormularioConcepto);  // Verifica si se activa el formulario
    this.inicializarFormularioFase(); // Inicializa el formulario para un nuevo concepto
  }
  
  //Catgoria Formulario
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
 //Iconos de fases
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

  //Cerrar los formularios y modales
  closeModal(): void {
    this.isModalOpen = false;
    this.mostrarContenido = false;
    this.faseSeleccionada = null;
    this.gruposConceptos = [];
    this.conceptos = [];
  }

  //Campos de categorias
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

  //Guardar el formulario de categorias
guardarYRedirigir(): void {
    console.log('Formulario:', this.formulario);

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
        title: 'Error de categoría',
        text: 'Hubo un problema al guardar la categoría seleccionada.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.isModalOpen = true;
      });
    }
  }

  // Mostrar iconos de las fases
  groupFasesByProceso(fases: any[]): any[] {
    const gruposF: any[] = []; 
    
    fases.forEach((fase, index) => {
      // Encuentra si ya existe un grupo para el idGrupo actual
      const procesoIndex = gruposF.findIndex(grupo => grupo.idGrupo === fase.idGrupo);
      
      // Obtén la lista de iconos correspondiente a este idGrupo
      const iconos = this.asignarIconos(fase.idGrupo);
      
      // Selecciona un icono de la lista usando el índice de la fase y el total de iconos disponibles
      const icono = iconos[index % iconos.length];
      
      if (procesoIndex === -1) {
        // Si el grupo no existe, créalo y agrega la fase con su icono
        gruposF.push({ idGrupo: fase.idGrupo, proceso: fase.proceso, fases: [{ ...fase, icono }] });
      } else {
        // Si el grupo ya existe, añade la fase al grupo con el icono asignado
        gruposF[procesoIndex].fases.push({ ...fase, icono });
      }
    });
    
    return gruposF;
  }
  
  asignarIconos(idGrupo: number): string[] {
    // Retorna el conjunto de iconos según el idGrupo de la fase
    switch (idGrupo) {
      case 1:
        return this.iconosFase1;
      case 2:
        return this.iconosFase2;
      case 3:
        return this.iconosFase3;
      default:
        return ['assets/iconos/icono-por-defecto.png']; // Icono por defecto si no coincide
    }
  }

  seleccionarGrupoConcepto(grupo: any) {
    this.mostrarContenido = false;
    this.obtenerConceptosPorFase(this.faseSeleccionada.id);
  }

  obtenerConceptosPorFase(idFase: number) {
    this.calculoDeCostosService.obtenerConceptosPorFase(idFase).subscribe(
      conceptos => {
        this.conceptos = conceptos;
        this.mostrarContenido = true;
      },
      error => console.error('Error al obtener conceptos por fase:', error)
    );
  }

  verDetalleFase(id: number): void {
    this.calculoDeCostosService.obtenerConceptoPorGrupo(id).subscribe({
      next: (data) => {
        console.log('Datos obtenidos:', data);
        if (Array.isArray(data) && data.length > 0) {
          this.faseSeleccionada = data[0];
          this.inicializarFormularioFase();
          this.isModalOpen = true;
        } else {
          console.warn('No se encontraron datos para esta fase');
          this.mostrarMensajeError();
        }
      },
      error: (err) => {
        console.error('Error al obtener concepto por grupo:', err);
        this.mostrarMensajeError();
      }
    });
  }
  
  mostrarMensajeError(): void {
    Swal.fire({
      icon: 'info',
      title: 'No se encontró información para esta fase',
      text: 'Se está mostrando el formulario por defecto.',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      this.faseSeleccionada = { id: null, nombre_fase: 'Fase sin datos', descripcion: 'No se encontró información para esta fase' };
      this.inicializarFormularioFase();
      this.isModalOpen = true;
    });
  }
  
  inicializarFormularioFase(): void {
    this.formularioConcepto = {
      concepto: '',
      cantidad: 0,
      valorUnitario: 0
    };
  }

  guardarConcepto(): void {
    if (!this.formularioConcepto.concepto || this.formularioConcepto.cantidad <= 0 || this.formularioConcepto.valorUnitario <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Debes llenar todos los campos requeridos para el concepto antes de continuar',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    const nuevoConcepto = {
      concepto: this.formularioConcepto.concepto,
      cantidad: this.formularioConcepto.cantidad,
      valorUnitario: this.formularioConcepto.valorUnitario,
      faseId: this.faseSeleccionada.id
    };
  
    this.calculoDeCostosService.crearConcepto(nuevoConcepto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Concepto guardado',
          text: 'El concepto se ha guardado exitosamente',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.formularioConcepto = { concepto: '', cantidad: 0, valorUnitario: 0 };
          this.mostrarFormularioConcepto = false;
          this.obtenerFasesPorGrupo();
        });
      },
      error: (err) => {
        console.error('Error al guardar el concepto:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: 'Hubo un problema al intentar guardar el concepto',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
  
camposCompletosConcepto(): boolean {
  const { concepto, cantidad, valorUnitario } = this.formularioConcepto;
  return Boolean(concepto) && cantidad > 0 && valorUnitario > 0;
}

}

