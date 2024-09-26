import { Component, OnInit } from '@angular/core';
import { ListadosService } from 'src/app/services/listados.service';

@Component({
  selector: 'app-buscar-asociados',
  templateUrl: './buscar-asociados.component.html',
  styleUrls: ['./buscar-asociados.component.css']
})
export class BuscarAsociadosComponent implements OnInit {

  asociados: any[] = [];
  asociadosFiltrados: any[] = [];
  searchTerm: string = '';

  constructor(private listadosService: ListadosService) {}

  ngOnInit(): void {
    this.listadosService.getAsociadosFinca().subscribe((data: any) => {
      this.asociados = data;
      this.asociadosFiltrados = [...this.asociados]; // Inicialmente muestra todos
    });
  }

  filtrarAsociados(): void {
    const normalizeString = (str: string): string => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };
  
    const term = normalizeString(this.searchTerm);
  
    this.asociadosFiltrados = this.asociados.filter(asociado =>
      normalizeString(asociado.nombres).includes(term) ||
      normalizeString(asociado.apellidos).includes(term) ||
      normalizeString(asociado.vereda).includes(term) ||
      normalizeString(asociado.nombre).includes(term)
    );
  }
  


}
