import { Component, OnInit } from '@angular/core';
import { ProductosCategoriasService } from 'src/app/services/productos-categorias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoriasproductos',
  templateUrl: './categoriasproductos.component.html',
  styleUrls: ['./categoriasproductos.component.css']
})
export class CategoriasproductosComponent implements OnInit {

  categorias: any[] = [];
  filteredCategorias: any[] = [];
  paginatedCategorias: any[] = [];
  searchTerm: string = '';
  filtersVisible: boolean = false;
  selectedCategoria: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  editModalVisible: boolean = false;
  activateModalVisible: boolean = false;
  deactivateModalVisible: boolean = false;
  createModalVisible: boolean = false;
  selectedCategoriaObj: any = {};
  newCategoria: any = {};
  totalRegistros: number = 0;

  constructor(private categoriasService: ProductosCategoriasService) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriasService.getCategorias().subscribe(
      data => {
        if (data && Array.isArray(data)) {
          this.categorias = data;
          this.filteredCategorias = [...this.categorias];
          this.searchTerm = '';
          this.updatePagination();
        } else {
          console.error('Error en la respuesta del servicio:', data);
          Swal.fire('Error', 'La respuesta del servicio no es válida.', 'error');
        }
      },
      error => {
        console.error('Error al obtener las categorías:', error);
        Swal.fire('Error', 'No se pudo obtener las categorías.', 'error');
      }
    );
  }

  buscar() {
    this.filteredCategorias = this.categorias.filter(categoria =>
      this.matchesSearchTerm(categoria) && this.matchesFilters(categoria)
    );
    this.currentPage = 1;
    this.totalRegistros = this.filteredCategorias.length;
    this.updatePagination();
  }

  matchesSearchTerm(categoria: any): boolean {
    return categoria.categoria.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

  matchesFilters(categoria: any): boolean {
    return (
      (!this.selectedCategoria || categoria.id == this.selectedCategoria)
    );
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCategorias.length / this.itemsPerPage);
    this.paginatedCategorias = this.filteredCategorias.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    this.totalRegistros = this.filteredCategorias.length;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  openEditModal(categoria: any): void {
    this.selectedCategoriaObj = { ...categoria };
    this.editModalVisible = true;
  }

  closeEditModal(): void {
    this.editModalVisible = false;
  }

  submitEditForm(): void {
    this.categoriasService.updateCategoria(this.selectedCategoriaObj).subscribe(
      data => {
        console.log('Categoría actualizada:', data);
        this.loadCategorias();
        this.closeEditModal();
        Swal.fire('Categoría Actualizada', 'La categoría ha sido actualizada correctamente.', 'success');
      },
      error => {
        console.error('Error al actualizar la categoría:', error);
        Swal.fire('Error', 'No se pudo actualizar la categoría.', 'error');
      }
    );
  }

  openActivateModal(categoria: any): void {
    this.selectedCategoriaObj = { ...categoria };
    this.activateModalVisible = true;
  }

  closeActivateModal(): void {
    this.activateModalVisible = false;
  }

  activateCategoria(): void {
    this.categoriasService.activateCategoria(this.selectedCategoriaObj.id).subscribe(
      data => {
        console.log('Categoría activada:', data);
        this.loadCategorias();
        this.closeActivateModal();
        Swal.fire('Categoría Activada', 'La categoría ha sido activada correctamente.', 'success');
      },
      error => {
        console.error('Error al activar la categoría:', error);
        Swal.fire('Error', 'No se pudo activar la categoría.', 'error');
      }
    );
  }

  openDeactivateModal(categoria: any): void {
    this.selectedCategoriaObj = { ...categoria };
    this.deactivateModalVisible = true;
  }

  closeDeactivateModal(): void {
    this.deactivateModalVisible = false;
  }

  deactivateCategoria(): void {
    this.categoriasService.deactivateCategoria(this.selectedCategoriaObj.id).subscribe(
      data => {
        console.log('Categoría desactivada:', data);
        this.loadCategorias();
        this.closeDeactivateModal();
        Swal.fire('Categoría Desactivada', 'La categoría ha sido desactivada correctamente.', 'success');
      },
      error => {
        console.error('Error al desactivar la categoría:', error);
        Swal.fire('Error', 'No se pudo desactivar la categoría.', 'error');
      }
    );
  }

  openCreateModal(): void {
    this.newCategoria = {};
    this.createModalVisible = true;
  }

  closeCreateModal(): void {
    this.createModalVisible = false;
  }

  submitCreateForm(): void {
    this.categoriasService.addCategoria(this.newCategoria).subscribe(
      data => {
        console.log('Categoría creada:', data);
        this.loadCategorias();
        this.closeCreateModal();
        Swal.fire('Categoría Creada', 'La categoría ha sido creada correctamente.', 'success');
      },
      error => {
        console.error('Error al crear la categoría:', error);
        Swal.fire('Error', 'No se pudo crear la categoría.', 'error');
      }
    );
  }

  getEstado(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }
}

  

