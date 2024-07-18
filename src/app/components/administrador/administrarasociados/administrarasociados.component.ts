import { Component, OnInit } from '@angular/core';
import { PersonasService } from 'src/app/services/personas.service';
import { SexoService } from 'src/app/services/sexo.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { EstadoCivilService } from 'src/app/services/estado-civil.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administrarasociados',
  templateUrl: './administrarasociados.component.html',
  styleUrls: ['./administrarasociados.component.css']
})
export class AdministrarasociadosComponent implements OnInit {

  personas: any[] = [];
  filteredPersonas: any[] = [];
  paginatedPersonas: any[] = [];
  sexos: any[] = [];
  tiposDocumento: any[] = [];
  estadosCiviles: any[] = [];
  searchTerm: string = '';
  filtersVisible: boolean = false;
  selectedSexo: string = '';
  selectedEstadoCivil: string = '';
  selectedEstado: string = '';
  selectedTipoDocumento: string = ''; 
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  editModalVisible: boolean = false;
  activateModalVisible: boolean = false;
  deactivateModalVisible: boolean = false;
  createModalVisible: boolean = false;
  selectedPersona: any = {};
  newPersona: any = {}; 

  constructor(
    private personasService: PersonasService,
    private sexoService: SexoService,
    private tipoDocumentoService: TipoDocumentoService,
    private estadoCivilService: EstadoCivilService
  ) {}

  ngOnInit(): void {
    this.loadPersonas();

    this.sexoService.getSexos().subscribe(
      data => {
        if (data) {
          this.sexos = data;
          console.log('Sexos:', this.sexos);
        }
      },
      error => {
        console.error('Error al obtener los sexos:', error);
      }
    );
  
    this.tipoDocumentoService.getTiposDocumento().subscribe(
      data => {
        if (data) {
          this.tiposDocumento = data;
          console.log('Tipos de Documento:', this.tiposDocumento);
        }
      },
      error => {
        console.error('Error al obtener los tipos de documento:', error);
      }
    );
  
    this.estadoCivilService.getEstadosCiviles().subscribe(
      data => {
        if (data) {
          this.estadosCiviles = data;
          console.log('Estados Civiles:', this.estadosCiviles);
        }
      },
      error => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );
  }

  loadPersonas(): void {
    this.personasService.getPersonas().subscribe(
      data => {
        this.personas = data;
        this.filteredPersonas = [...this.personas];
        this.updatePagination();
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
  
  buscar() {
    this.filteredPersonas = this.personas.filter(persona =>
      this.matchesSearchTerm(persona) && this.matchesFilters(persona)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  matchesSearchTerm(persona: any): boolean {
    return Object.values(persona).some(value =>
      String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  matchesFilters(persona: any): boolean {
    return (
      (!this.selectedSexo || persona.sexo == this.selectedSexo) &&
      (!this.selectedEstadoCivil || persona.estado_civil == this.selectedEstadoCivil) &&
      (!this.selectedEstado || persona.estado == this.selectedEstado) &&
      (!this.selectedTipoDocumento || persona.tipo_documento == this.selectedTipoDocumento) 

    );
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPersonas.length / this.itemsPerPage);
    this.paginatedPersonas = this.filteredPersonas.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
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

  openEditModal(persona: any): void {
    this.selectedPersona = { ...persona };
    this.editModalVisible = true;
  }

  closeEditModal(): void {
    this.editModalVisible = false;
  }

  submitEditForm(): void {
    this.personasService.updatePersona(this.selectedPersona).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Persona actualizada correctamente.', 'success');
        this.loadPersonas();
        this.closeEditModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo actualizar la persona.', 'error');
        console.error(error);
      }
    );
  }

  openActivateModal(persona: any): void {
    this.selectedPersona = { ...persona };
    this.activateModalVisible = true;
  }

  closeActivateModal(): void {
    this.activateModalVisible = false;
  }

  activatePersona(): void {
    this.personasService.activatePersona(this.selectedPersona.id).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Persona activada correctamente.', 'success');
        this.loadPersonas();
        this.closeActivateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo activar la persona.', 'error');
        console.error(error);
      }
    );
  }

  openDeactivateModal(persona: any): void {
    this.selectedPersona = { ...persona };
    this.deactivateModalVisible = true;
  }

  closeDeactivateModal(): void {
    this.deactivateModalVisible = false;
  }

  deactivatePersona(): void {
    this.personasService.deactivatePersona(this.selectedPersona.id).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Persona desactivada correctamente.', 'success');
        this.loadPersonas();
        this.closeDeactivateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo desactivar la persona.', 'error');
        console.error(error);
      }
    );
  }

  openCreateModal(): void {
    this.newPersona = {};
    this.createModalVisible = true;
  }

  closeCreateModal(): void {
    this.createModalVisible = false;
  }

  submitCreateForm(): void {
    this.personasService.addPersona(this.newPersona).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Usuario creado correctamente.', 'success');
        this.loadPersonas();
        this.closeCreateModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo crear el usuario.', 'error');
        console.error(error);
      }
    );
  }


  getSexo(id: number): string {
    const sexo = this.sexos.find(s => s.id === id);
    return sexo ? sexo.sexo : '';
  }

  getTipoDocumento(id: number): string {
    const tipoDocumento = this.tiposDocumento.find(td => td.id === id);
    return tipoDocumento ? tipoDocumento.tipo_documento : '';
  }

  getEstadoCivil(id: number): string {
    const estadoCivil = this.estadosCiviles.find(ec => ec.id === id);
    return estadoCivil ? estadoCivil.estado_civil : '';
  }

  getEstado(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }
}
