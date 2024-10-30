import { Component , OnInit} from '@angular/core';
import { GruposService } from 'src/app/services/grupos.service';


@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit{
  grupos: any[] = [];

  constructor(private GruposService: GruposService) {}

  ngOnInit(): void {
    this.obtenerGrupos();
}

obtenerGrupos(): void {
  this.GruposService.getGrupos().subscribe(
    (response) => {
      if (response.estado === 'Ok' && response.grupo && Array.isArray(response.grupo)) {
        console.log("Datos recibidos:", response.grupo); 
        this.grupos = response.grupo; // Debería tener solo 4 elementos
      } else {
        console.warn("Se esperaban grupos, pero se recibió:", response.grupo);
      }
    },
    (error) => {
      console.error('Error al obtener los grupos:', error);
    }
  );
}

getIconUrl(grupo: string): string {
  switch (grupo) {
    case 'Cultivos':
      return 'assets/iconos/cultivo_icon.png';
    case 'Huevos':
      return 'assets/iconos/carton-de-huevos_icon.png';
    case 'Carnes':
      return 'assets/iconos/carnes_icon.png';
    case 'Transformados':
      return 'assets/iconos/transformados_icon.png';
    default:
      return 'assets/iconos/transformados_icon.png'; // Icono predeterminado si no coincide
  }
}

}