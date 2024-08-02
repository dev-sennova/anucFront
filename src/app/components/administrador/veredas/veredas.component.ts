import { Component, OnInit } from '@angular/core';
import { VeredasService } from 'src/app/services/veredas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-veredas',
  templateUrl: './veredas.component.html',
  styleUrls: ['./veredas.component.css']
})
export class VeredasComponent implements OnInit {
  veredas: any[] = [];
  filteredVeredas: any[] = [];
  paginatedVeredas: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  editModalVisible: boolean = false;
  activateModalVisible: boolean = false;
  deactivateModalVisible: boolean = false;
  createModalVisible: boolean = false;
  selectedVereda: any = {};
  newVereda: any = { vereda: '', ciudad: '320' };

  constructor(private veredasService: VeredasService) {}

  ngOnInit(): void {
    this.loadVeredas();
  }

  loadVeredas(): void {
    this.veredasService.getVeredas().subscribe(
      data => {
        this.veredas = data;
        this.filteredVeredas = [...this.veredas];
        this.searchTerm = '';
        this.updatePagination();
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  buscar() {
    this.filteredVeredas = this.veredas.filter(vereda =>
      this.matchesSearchTerm(vereda)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  matchesSearchTerm(vereda: any): boolean {
    return Object.values(vereda).some(value =>
      String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredVeredas.length / this.itemsPerPage);
    this.paginatedVeredas = this.filteredVeredas.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
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

  openEditModal(vereda: any): void {
    this.selectedVereda = { ...vereda };
    this.editModalVisible = true;
  }

  closeEditModal(): void {
    this.editModalVisible = false;
  }

  submitEditForm(): void {
    this.veredasService.updateVereda(this.selectedVereda).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Vereda actualizada correctamente.', 'success');
        this.loadVeredas();
        this.closeEditModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo actualizar la vereda.', 'error');
        console.error(error);
      }
    );
  }

  openActivateModal(vereda: any): void {
    this.selectedVereda = { ...vereda };
    this.activateModalVisible = true;
  }

  closeActivateModal(): void {
    this.activateModalVisible = false;
  }

  activateVereda(): void {
    this.veredasService.activateVereda(this.selectedVereda.id).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Vereda activada correctamente.', 'success');
        this.loadVeredas();
        this.closeActivateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo activar la vereda.', 'error');
        console.error(error);
      }
    );
  }

  openDeactivateModal(vereda: any): void {
    this.selectedVereda = { ...vereda };
    this.deactivateModalVisible = true;
  }

  closeDeactivateModal(): void {
    this.deactivateModalVisible = false;
  }

  deactivateVereda(): void {
    this.veredasService.deactivateVereda(this.selectedVereda.id).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Vereda desactivada correctamente.', 'success');
        this.loadVeredas();
        this.closeDeactivateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo desactivar la vereda.', 'error');
        console.error(error);
      }
    );
  }

  openCreateModal(): void {
    this.newVereda = { vereda: '', ciudad: '320' };
    this.createModalVisible = true;
  }

  closeCreateModal(): void {
    this.createModalVisible = false;
  }

  submitCreateForm(): void {
    this.veredasService.addVereda(this.newVereda).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Vereda creada correctamente.', 'success');
        this.loadVeredas();
        this.closeCreateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo crear la vereda.', 'error');
        console.error(error);
      }
    );
  }
}
