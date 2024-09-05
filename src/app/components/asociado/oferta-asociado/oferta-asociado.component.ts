import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OfertasAsociadoService } from 'src/app/services/ofertas-asociado.service';
import { PersonasService } from 'src/app/services/personas.service';
import { ProductosCategoriasService } from 'src/app/services/productos-categorias.service';
import { UnidadesMedidaService } from 'src/app/services/unidades-medida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-oferta-asociado',
  templateUrl: './oferta-asociado.component.html',
  styleUrls: ['./oferta-asociado.component.css']
})
export class OfertaAsociadoComponent {

  ofertas: any[] = [];
  productos: any[] = [];
  unidades: any[] = [];
  filteredOfertas: any[] = [];
  paginatedOfertas: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  createModalVisible: boolean = false;
  editModalVisible: boolean = false;
  activateModalVisible: boolean = false;
  deactivateModalVisible: boolean = false;
  selectedOferta: any = {};
  newOferta: any = {};
  idUsuario: string = '';

  constructor(
    private ofertasAsociadoService: OfertasAsociadoService,
    private productosService: ProductosCategoriasService,
    private unidadesService: UnidadesMedidaService,
    private personasService: PersonasService,
  private router: Router) { }

  ngOnInit(): void {
    this.loadOfertas();
    this.loadProductos();
    this.loadUnidades();
  }

  loadOfertas(): void {
    const asociadosFincaId  = localStorage.getItem('identificador_usuario') || '';
    this.ofertasAsociadoService.getOfertas(asociadosFincaId).subscribe(
      data => {
        if (data && data.estado === 'Ok' && Array.isArray(data.ofertasActivas)) {
          this.ofertas = data.ofertasActivas;
          this.filteredOfertas = [...this.ofertas];
          this.updatePagination();
        } else {
          Swal.fire('Error', 'La respuesta del servicio no es válida.', 'error');
        }
      },
      error => {
        Swal.fire('Error', 'No se pudo obtener las ofertas.', 'error');
      }
    );
  }

  loadProductos(): void {
    const asociadosFincaId  = localStorage.getItem('identificador_usuario') || '';
    this.personasService.getInfoOneAsociadoProductos(asociadosFincaId).subscribe(
      data => {
        if (data) {
          this.productos = data;
          this.searchTerm = '';
          this.updatePagination();
        } else {
          console.error('Error en la respuesta del servicio:', data);
          Swal.fire('Error', 'La respuesta del servicio no es válida.', 'error');
        }
      },
      error => {
        console.error('Error al obtener los productos:', error);
        Swal.fire('Error', 'No se pudo obtener los productos.', 'error');
      }
    );
  }


  loadUnidades(): void {
    this.unidadesService.getUnidades().subscribe(
      data => {
        if (data) {
          this.unidades = data;
          console.log('Categorías:', this.unidades);
        }
      },
      error => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  getProductoNombre(productId: number): string {
    const producto = this.productos.find(prod => prod.idProducto === productId);
    return producto ? producto.producto : '';
  }

  getUnidadNombre(unidadId: number): string {
    const unidad = this.unidades.find(unid => unid.id === unidadId);
    return unidad ? unidad.unidad : '';
  }

  buscar(): void {
    this.filteredOfertas = this.ofertas.filter(oferta => this.matchesSearchTerm(oferta));
    this.currentPage = 1;
    this.updatePagination();
  }

  matchesSearchTerm(oferta: any): boolean {
    return oferta.product_id.toString().includes(this.searchTerm);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOfertas.length / this.itemsPerPage);
    this.paginatedOfertas = this.filteredOfertas.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  openCreateModal(): void {
    this.newOferta = {};
    this.createModalVisible = true;
  }

  closeCreateModal(): void {
    this.createModalVisible = false;
  }

  submitCreateForm(): void {
    const asociadosFincaId  = localStorage.getItem('identificador_usuario') || '';

    this.ofertasAsociadoService.addOferta(this.newOferta, asociadosFincaId).subscribe(
      response => {
        Swal.fire('Éxito', 'Oferta creada correctamente.', 'success');
        this.loadOfertas();
        this.closeCreateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo crear la oferta.', 'error');
      }
    );
  }

  openEditModal(oferta: any): void {
    this.selectedOferta = { ...oferta };
    this.editModalVisible = true;
  }

  closeEditModal(): void {
    this.editModalVisible = false;
  }

  submitEditForm(): void {

    const asociadosFincaId  = localStorage.getItem('identificador_usuario') || '';

    this.ofertasAsociadoService.updateOferta(this.selectedOferta, asociadosFincaId).subscribe(
      response => {
        Swal.fire('Éxito', 'Oferta actualizada correctamente.', 'success');
        this.loadOfertas();
        this.closeEditModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo actualizar la oferta.', 'error');
      }
    );
  }

  openDeactivateModal(oferta: any): void {
    this.selectedOferta = { ...oferta };
    this.deactivateModalVisible = true;
  }

  closeDeactivateModal(): void {
    this.deactivateModalVisible = false;
  }

  deactivateOferta(): void {

    const ofertaId = this.selectedOferta.id; 
    this.ofertasAsociadoService.deactivateOferta(ofertaId).subscribe(
      data => {
        this.loadOfertas();
        this.closeDeactivateModal();
        Swal.fire('Oferta Desactivada', 'La oferta ha sido desactivada correctamente.', 'success');
      },
      error => {
        Swal.fire('Error', 'No se pudo desactivar la oferta.', 'error');
      }
    );
}

}
