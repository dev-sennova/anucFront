import { Component, OnInit } from '@angular/core';
import { ParentescosService } from 'src/app/services/parentescos.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-parentescos',
  templateUrl: './parentescos.component.html',
  styleUrls: ['./parentescos.component.css']
})
export class ParentescosComponent implements OnInit {

  parentescos: any[] = [];
  filteredParentescos: any[] = [];
  paginatedParentescos: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  editModalVisible: boolean = false;
  activateModalVisible: boolean = false;
  deactivateModalVisible: boolean = false;
  createModalVisible: boolean = false;
  selectedParentesco: any = {};
  newParentesco: any = {};

  
  constructor(private parentescosService: ParentescosService){}

  ngOnInit(): void {
    this.loadParentescos();
  }

  loadParentescos(): void {
    this.parentescosService.getParentescos().subscribe(
      data => {
        this.parentescos = data;
        this.filteredParentescos = [...this.parentescos];
        this.searchTerm = '';
        this.updatePagination();
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  buscar() {
    this.filteredParentescos = this.parentescos.filter(parentesco =>
      this.matchesSearchTerm(parentesco)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  matchesSearchTerm(parentesco: any): boolean {
    return Object.values(parentesco).some(value =>
      String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredParentescos.length / this.itemsPerPage);
    this.paginatedParentescos = this.filteredParentescos.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
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

  openEditModal(parentesco: any): void {
    this.selectedParentesco = { ...parentesco };
    this.editModalVisible = true;
  }

  closeEditModal(): void {
    this.editModalVisible = false;
  }

  submitEditForm(): void {
    this.parentescosService.updateParentesco(this.selectedParentesco).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Parentesco actualizado correctamente.', 'success');
        this.loadParentescos();
        this.closeEditModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo actualizar el parentesco.', 'error');
        console.error(error);
      }
    );
  }

  openActivateModal(parentesco: any): void {
    this.selectedParentesco = { ...parentesco };
    this.activateModalVisible = true;
  }

  closeActivateModal(): void {
    this.activateModalVisible = false;
  }

  activateParentesco(): void {
    this.parentescosService.activateParentesco(this.selectedParentesco.id).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'parentesco activado correctamente.', 'success');
        this.loadParentescos();
        this.closeActivateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo activar el parentesco.', 'error');
        console.error(error);
      }
    );
  }

  openDeactivateModal(parentesco: any): void {
    this.selectedParentesco = { ...parentesco };
    this.deactivateModalVisible = true;
  }

  closeDeactivateModal(): void {
    this.deactivateModalVisible = false;
  }

  deactivateParentesco(): void {
    this.parentescosService.deactivateParentesco(this.selectedParentesco.id).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Parentesco desactivado correctamente.', 'success');
        this.loadParentescos();
        this.closeDeactivateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo desactivar el parentesco.', 'error');
        console.error(error);
      }
    );
  }

  openCreateModal(): void {
    this.newParentesco = {}; 
    this.createModalVisible = true;
  }

  closeCreateModal(): void {
    this.createModalVisible = false;
  }

  submitCreateForm(): void {
    this.parentescosService.addParentesco(this.newParentesco).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Parentesco creado correctamente.', 'success');
        this.loadParentescos();
        this.newParentesco = {}; 
        this.closeCreateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo crear el Parentesco.', 'error');
        console.error(error);
      }
    );
  }



}
