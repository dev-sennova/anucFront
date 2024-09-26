import { Component, OnInit } from '@angular/core';
import { ListadosService } from 'src/app/services/listados.service';
import { PersonasService } from 'src/app/services/personas.service';
import { ParentescosService } from 'src/app/services/parentescos.service';
import * as XLSX from 'xlsx';
import { saveAs} from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

interface Parentesco {
  id: number;
  parentesco: string;
  estado: number;
}

interface ParentescoMap {
  [key: number]: string;
}

@Component({
  selector: 'app-listadogeneral',
  templateUrl: './listadogeneral.component.html',
  styleUrls: ['./listadogeneral.component.css']
})
export class ListadogeneralComponent implements OnInit {

  selectedAsociado: any;
  parentescoMap: ParentescoMap = {}; 
  showModal: boolean = false;
  asociadosFinca: any[] = [];
  filteredAsociados: any[] = [];
  paginatedAsociados: any[] = [];
  searchTerm: string = '';
  filtersVisible: boolean = false;
  selectedGenero: string = '';
  selectedCategoria: string = '';
  selectedEstadoCivil: string = '';
  selectedVereda: string = '';
  selectedTipoPredio: string = '';
  selectedAgeRange: string = '';
  categorias: string[] = [];
  estadosCiviles: string[] = [];
  parentescos: Parentesco[] = [];
  veredas: string[] = [];
  tiposPredio: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  totalRegistros: number = 0;

  constructor(
    private listadosService: ListadosService,
    private personasService: PersonasService,
    private parentescosService: ParentescosService
  ) { }

  ngOnInit(): void {
    this.loadAsociados();
    this.loadParentescos();
  }

  loadAsociados() {
    this.listadosService.getAsociadosFinca().subscribe(
      data => {
        this.asociadosFinca = data;
        this.filteredAsociados = [...this.asociadosFinca];
        this.categorias = [...new Set(this.asociadosFinca.map(asociado => asociado.categoria))];
        this.estadosCiviles = [...new Set(this.asociadosFinca.map(asociado => asociado.estado_civil))];
        this.veredas = [...new Set(this.asociadosFinca.map(asociado => asociado.vereda))];
        this.tiposPredio = [...new Set(this.asociadosFinca.map(asociado => asociado.tipo_predio))];
        this.updatePagination();
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  loadParentescos() {
    this.parentescosService.getParentescos().subscribe(
      data => {
        console.log('Respuesta completa del servicio:', data); // Verifica que la respuesta es como se espera

        // Aquí asumimos que `data` es un arreglo de objetos de parentesco
        if (Array.isArray(data)) {
          this.parentescoMap = data.reduce((map: ParentescoMap, parentesco: Parentesco) => {
            map[parentesco.id] = parentesco.parentesco;
            return map;
          }, {});
          console.log('ParentescoMap:', this.parentescoMap); // Verifica el resultado final del reduce
        } else {
          this.parentescoMap = {};
          console.warn('No se recibieron parentescos válidos.');
        }
      },
      error => {
        console.error('Error al cargar los parentescos:', error);
      }
    );
  }


  getParentesco(id: number): string {
    return this.parentescoMap[id] || 'Desconocido'; // Usa el mapeo para obtener el nombre del parentesco
  }

  getUniqueFincas(produccion: any[]): any[] {
    if (!produccion) {
      return []; // Devuelve un array vacío si produccion es null o undefined
    }

    const fincaNames = new Set();
    const uniqueFincas: any[] = [];

    produccion.forEach(producto => {
      if (producto && !fincaNames.has(producto.nombre)) {
        fincaNames.add(producto.nombre);
        uniqueFincas.push({
          nombre: producto.nombre,
          extension: producto.extension
        });
      }
    });

    return uniqueFincas;
  }



  verInformacion(asociado: number) {
    
    this.personasService.getInfoAsociado(asociado).subscribe(
      data => {
        this.selectedAsociado = data;
        console.log('Familiares:', this.selectedAsociado?.familiares);
        this.showModal = true;
      },
      error => {
        console.error('Error al obtener la información del asociado:', error);
      }
    );
  }

  closeModal() {
    this.showModal = false;
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
  matchesAgeRange(asociado: any): boolean {
    if (!this.selectedAgeRange) return true; // Si no se selecciona rango de edad
    const edad = this.calcularEdad(asociado.fecha_nacimiento);
    const [minAge, maxAge] = this.selectedAgeRange.split('-').map(Number);
    return edad >= minAge && edad <= maxAge;
  }

  buscar() {
    this.filteredAsociados = this.asociadosFinca.filter(asociado =>
      this.matchesSearchTerm(asociado) && this.matchesFilters(asociado) && this.matchesAgeRange(asociado)
    );
    this.currentPage = 1;
    this.totalRegistros = this.filteredAsociados.length;
    this.updatePagination();
  }

  matchesSearchTerm(asociado: any): boolean {
    return Object.values(asociado).some(value =>
      String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  matchesFilters(asociado: any): boolean {
    return (
      (!this.selectedGenero || asociado.sexo === this.selectedGenero) &&
      (!this.selectedCategoria || asociado.categoria === this.selectedCategoria) &&
      (!this.selectedEstadoCivil || asociado.estado_civil === this.selectedEstadoCivil) &&
      (!this.selectedVereda || asociado.vereda === this.selectedVereda) &&
      (!this.selectedTipoPredio || asociado.tipo_predio === this.selectedTipoPredio)
    );
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredAsociados.length / this.itemsPerPage);
    this.paginatedAsociados = this.filteredAsociados.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    this.totalRegistros = this.filteredAsociados.length;
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

  exportToExcel() {
    // Filtrar los datos que están visibles en la tabla
    const dataToExport = this.filteredAsociados.map(({ nombres, apellidos, sexo, categoria, fecha_nacimiento, identificacion, estado_civil, telefono, vereda, nombre, tipo_predio, extension }) => ({
      nombres, 
      apellidos, 
      sexo, 
      categoria, 
      fecha_nacimiento, 
      identificacion, 
      estado_civil, 
      telefono, 
      vereda, 
      nombre, 
      tipo_predio, 
      extension 
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
