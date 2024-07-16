import { Component, OnInit } from '@angular/core';
import { ListadosService } from 'src/app/services/listados.service';

@Component({
  selector: 'app-listadogeneral',
  templateUrl: './listadogeneral.component.html',
  styleUrls: ['./listadogeneral.component.css']
})
export class ListadogeneralComponent implements OnInit {
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
  categorias: string[] = [];
  estadosCiviles: string[] = [];
  veredas: string[] = [];
  tiposPredio: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private listadosService: ListadosService) { }

  ngOnInit(): void {
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

  buscar() {
    this.filteredAsociados = this.asociadosFinca.filter(asociado =>
      this.matchesSearchTerm(asociado) && this.matchesFilters(asociado)
    );
    this.currentPage = 1;
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
  
}
