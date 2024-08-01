import { Component, OnInit } from '@angular/core';
import { UnidadesMedidaService } from 'src/app/services/unidades-medida.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-informaciondesplegable',
  templateUrl: './informaciondesplegable.component.html',
  styleUrls: ['./informaciondesplegable.component.css']
})
export class InformaciondesplegableComponent implements OnInit {

  unidades: any[] = [];
  filteredUnidades: any[] = [];
  paginatedUnidades: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  editModalVisible: boolean = false;
  activateModalVisible: boolean = false;
  deactivateModalVisible: boolean = false;
  createModalVisible: boolean = false;
  selectedUnidad: any = {};
  newUnidad: any = {};

  constructor(private unidadesMedidaService: UnidadesMedidaService) {}

  ngOnInit(): void {
    this.loadUnidades();
  }

  loadUnidades(): void {
    this.unidadesMedidaService.getUnidades().subscribe(
      data => {
        this.unidades = data;
        this.filteredUnidades = [...this.unidades];
        this.searchTerm = '';
        this.updatePagination();
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  buscar() {
    this.filteredUnidades = this.unidades.filter(unidad =>
      this.matchesSearchTerm(unidad)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  matchesSearchTerm(unidad: any): boolean {
    return Object.values(unidad).some(value =>
      String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUnidades.length / this.itemsPerPage);
    this.paginatedUnidades = this.filteredUnidades.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
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

  openEditModal(unidad: any): void {
    this.selectedUnidad = { ...unidad };
    this.editModalVisible = true;
  }

  closeEditModal(): void {
    this.editModalVisible = false;
  }

  submitEditForm(): void {
    this.unidadesMedidaService.updateUnidad(this.selectedUnidad).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Unidad actualizada correctamente.', 'success');
        this.loadUnidades();
        this.closeEditModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo actualizar la unidad.', 'error');
        console.error(error);
      }
    );
  }

  openActivateModal(unidad: any): void {
    this.selectedUnidad = { ...unidad };
    this.activateModalVisible = true;
  }

  closeActivateModal(): void {
    this.activateModalVisible = false;
  }

  activateUnidad(): void {
    this.unidadesMedidaService.activateUnidad(this.selectedUnidad.id).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Unidad activada correctamente.', 'success');
        this.loadUnidades();
        this.closeActivateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo activar la unidad.', 'error');
        console.error(error);
      }
    );
  }

  openDeactivateModal(unidad: any): void {
    this.selectedUnidad = { ...unidad };
    this.deactivateModalVisible = true;
  }

  closeDeactivateModal(): void {
    this.deactivateModalVisible = false;
  }

  deactivateUnidad(): void {
    this.unidadesMedidaService.deactivateUnidad(this.selectedUnidad.id).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Unidad desactivada correctamente.', 'success');
        this.loadUnidades();
        this.closeDeactivateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo desactivar la unidad.', 'error');
        console.error(error);
      }
    );
  }

  openCreateModal(): void {
    this.newUnidad = {};
    this.createModalVisible = true;
  }

  closeCreateModal(): void {
    this.createModalVisible = false;
  }

  submitCreateForm(): void {
    this.unidadesMedidaService.addUnidad(this.newUnidad).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Unidad creada correctamente.', 'success');
        this.loadUnidades();
        this.closeCreateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo crear la unidad.', 'error');
        console.error(error);
      }
    );
  }
  
}
