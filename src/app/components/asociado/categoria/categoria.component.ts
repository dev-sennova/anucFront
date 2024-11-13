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
  idSentAsociado: string = "";
  bloqcat: any[] = [];
  productoSeleccionado: string | number = '';
  selectedCategory: any = null;

  constructor(
    private calculoDeCostosService: CalculodecostosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let idSentAsociado = localStorage.getItem('identificador_asociado') || '';
    console.log('idAsociado obtenido:', idSentAsociado);
    let idAsociadoNum: number = Number(idSentAsociado);
    idSentAsociado = idAsociadoNum.toString();

    if (idSentAsociado) {
      this.cargarProductos(idSentAsociado);
      this.cargarCategorias(idSentAsociado);
    } else {
      console.error('No se encontró idAsociado en el localStorage');
    }
  }

  cargarProductos(idAsociado: string): void {
    this.calculoDeCostosService.getProductosPorAsociado(idAsociado).subscribe(
      (data) => {
        if (data && Array.isArray(data.productos)) {
          this.productos = data.productos;
          this.filteredProductos = [...this.productos];
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

  cargarCategorias(idAsociado: string): void {
    this.calculoDeCostosService.getCategoriasPorUsuario(idAsociado).subscribe(
      (data) => {
        if (data && data.categorias && Array.isArray(data.categorias)) {
          this.bloqcat = data.categorias;
          console.log('Categorías cargadas:', this.bloqcat);
        } else {
          Swal.fire('Error', 'No se pudieron cargar las categorías del usuario.', 'error');
        }
      },
      (error) => {
        Swal.fire('Error', 'No se pudieron cargar las categorías del asociado.', 'error');
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

  openModal(categoria: any) {
    this.selectedCategory = categoria;
    this.filterByCategory(categoria);
  }

  filterByCategory(category: any): void {
    this.selectedCategory = category;
    if (this.productos.length > 0) {
      this.filteredProductos = this.productos.filter(product => product.idGrupo === category.idGrupo);
    }
  }

  onClickCategoria(categoria: any) {
    console.log('Categoria seleccionada:', categoria);
    localStorage.setItem('idGrupo', categoria.idGrupo);
    console.log('ID guardado en localStorage:', localStorage.getItem('idGrupo'));
     // Redirecciona al componente ListadodecostosComponent
    this.router.navigate(['/asociado/listadodecostos/' + categoria.idGrupo]);
  }
}
