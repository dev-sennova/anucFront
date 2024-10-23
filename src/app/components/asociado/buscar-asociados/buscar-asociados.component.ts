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
    this.listadosService.getAsociadosFinca().subscribe((data: any[]) => {
    

      this.asociados = data.filter(asociado => 
        asociado.habeasData !== 0 &&
        (asociado.telefono || asociado.correo || asociado.whatsapp || asociado.facebook || asociado.instagram) 
      );
      
      this.asociadosFiltrados = this.asociados.map(asociado => ({
        ...asociado,
        telefono: (asociado.permisotelefono === 1 || asociado.permisotelefono === 3) ? asociado.telefono : null,
        correo: (asociado.permisocorreo === 1 || asociado.permisocorreo === 3) ? asociado.correo : null,
        whatsapp: (asociado.permisowhatsapp === 1 || asociado.permisowhatsapp === 3) ? asociado.whatsapp : null,
        facebook: (asociado.permisofacebook === 1 || asociado.permisofacebook === 3) ? asociado.facebook : null,
        instagram: (asociado.permisoinstagram === 1 || asociado.permisoinstagram === 3) ? asociado.instagram : null,
      })).filter(asociado => 
        asociado.telefono || asociado.correo || asociado.whatsapp || asociado.facebook || asociado.instagram 
      );

      this.asociadosFiltrados = [...this.asociadosFiltrados]; 
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
