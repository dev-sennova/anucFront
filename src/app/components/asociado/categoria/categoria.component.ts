import { Component, OnInit } from '@angular/core';
import { GruposService } from 'src/app/services/grupos.service';
import { CalculodecostosService } from 'src/app/services/calculodecostos.service';
import { UnidadesMedidaService } from 'src/app/services/unidades-medida.service';
import { Router } from '@angular/router';

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
    cantidadGallinas: null,
    cantidadHuevosProducir: null,
    cantidadHectarias: null,
    cantidadProducir: null,
    cantidadCrias: null,
    cantidadEsperadaProducir: null,
    cantidadTransformados: null,
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
          console.log("Datos recibidos:", response.grupo);
          this.grupos = response.grupo; // Almacena los grupos
        } else {
          console.warn("Se esperaban grupos, pero se recibió:", response.grupo);
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
    this.inicializarFormulario(); // Inicializa el formulario con los campos correctos
  }

  inicializarFormulario(): void {
    // Reiniciar los campos
    this.formulario.cantidadGallinas = null;
    this.formulario.cantidadHuevosProducir = null;
    this.formulario.cantidadHectarias = null;
    this.formulario.cantidadProducir = null;
    this.formulario.cantidadCrias = null;
    this.formulario.cantidadEsperadaProducir = null;
    this.formulario.cantidadTransformados = null;
    this.formulario.descripcion = '';

    // Verifica el nombre de la categoría
    if (!this.categoriaSeleccionada || !this.categoriaSeleccionada.nombre) {
      console.error('Categoría no seleccionada o no válida');
      return;
    }

    // Agregar campos según la categoría seleccionada
    switch (this.categoriaSeleccionada.nombre) {
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
      default:
        console.warn('Categoría no reconocida:', this.categoriaSeleccionada.nombre);
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
    console.log('Formulario guardado:', this.formulario);
    this.categoriaSeleccionada = null;
    this.formulario = {
      producto: '',
      medida: '',
      cantidadGallinas: null,
      cantidadHuevosProducir: null,
      cantidadHectarias: null,
      cantidadProducir: null,
      cantidadCrias: null,
      cantidadEsperadaProducir: null,
      cantidadTransformados: null,
      descripcion: ''
    }; 
  }
}
