import { Component, OnInit } from '@angular/core';
import { PersonasService } from 'src/app/services/personas.service';
import { SexoService } from 'src/app/services/sexo.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { EstadoCivilService } from 'src/app/services/estado-civil.service';
import { RolesService } from 'src/app/services/roles.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs} from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

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
  roles: any[] = [];
  filteredRoles: any[] = [];
  tiposDocumento: any[] = [];
  estadosCiviles: any[] = [];
  searchTerm: string = '';
  filtersVisible: boolean = false;
  selectedSexo: string = '';
  selectedEstadoCivil: string = '';
  selectedEstado: string = '';
  selectedTipoDocumento: string = ''; 
  selectedAgeRange: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  editModalVisible: boolean = false;
  activateModalVisible: boolean = false;
  deactivateModalVisible: boolean = false;
  createModalVisible: boolean = false;
  selectedPersona: any = {};
  newPersona: any = {}; 
  totalRegistros: number = 0;

  constructor(
    private personasService: PersonasService,
    private sexoService: SexoService,
    private tipoDocumentoService: TipoDocumentoService,
    private estadoCivilService: EstadoCivilService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.loadPersonas();
    this.loadRoles();

    this.sexoService.getSexos().subscribe(
      data => {
        if (data) {
          this.sexos = data;
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
        this.searchTerm = '';
        this.updatePagination();
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe(
      data => {
        const allRoles = data || [];
        const userRole = localStorage.getItem('rol_usuario');

        if (userRole === 'SuperAdministrador') {
          // Si es SuperAdministrador, mostrar todos los roles
          this.filteredRoles = allRoles;
        } else if (userRole === 'Administrador') {
          // Si es Administrador, solo mostrar el rol de Asociado
          this.filteredRoles = allRoles.filter((rol: any) => rol.rol === 'Asociado');
        }
      },
      error => console.error('Error al obtener los roles:', error)
    );
  }
  // Calcular edad desde la fecha de nacimiento
  calcularEdad(fechaNacimiento: string): number {
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Filtrar según la edad seleccionada
  matchesAgeRange(persona: any): boolean {
    if (!this.selectedAgeRange) return true; // Si no se selecciona rango de edad
    const edad = this.calcularEdad(persona.fecha_nacimiento);
    const [minAge, maxAge] = this.selectedAgeRange.split('-').map(Number);
    return edad >= minAge && edad <= maxAge;
  }

  
  buscar() {
    this.filteredPersonas = this.personas.filter(persona =>
      this.matchesSearchTerm(persona) &&
      this.matchesFilters(persona) &&
      this.matchesAgeRange(persona)
    );
    this.currentPage = 1;
    this.totalRegistros = this.filteredPersonas.length;
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
    this.totalRegistros = this.filteredPersonas.length;
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
    this.newPersona = {
      idRol: '',
      nombres: '',
      apellidos: '',
      identificacion: '',
      telefono: '',
      fecha_nacimiento: '',
      tipo_documento: '',
      sexo: '',
      estado_civil: ''
    };
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

  exportToExcel() {
    // Filtrar los datos que están visibles en la tabla
    const dataToExport = this.filteredPersonas.map(({ 
      id, 
      nombres, 
      apellidos, 
      sexo, 
      fecha_nacimiento, 
      tipo_documento, 
      identificacion, 
      estado_civil, 
      telefono, 
      estado 
    }) => ({
      Id: id, 
      Nombres: nombres, 
      Apellidos: apellidos, 
      Sexo: this.getSexo(sexo),  // Usar la función para mostrar el texto correcto
      'Fecha de Nacimiento': fecha_nacimiento, 
      'Tipo de Documento': this.getTipoDocumento(tipo_documento),  // Usar la función para mostrar el texto correcto
      Identificación: identificacion, 
      'Estado Civil': this.getEstadoCivil(estado_civil),  // Usar la función para mostrar el texto correcto
      Teléfono: telefono, 
      Estado: this.getEstado(estado)  // Usar la función para mostrar el texto correcto
    }));
  
    // Crear un libro de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };
  
    // Generar el archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Guardar el archivo
    this.saveAsExcelFile(excelBuffer, 'Usuarios_ANUC');
  }
  
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
  
}
