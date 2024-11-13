import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalculodecostosService } from 'src/app/services/calculodecostos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listadodecostos',
  templateUrl: './listadodecostos.component.html',
  styleUrls: ['./listadodecostos.component.css']
})
export class ListadodecostosComponent implements OnInit {
  idGrupo?: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private calculoDeCostosService: CalculodecostosService
  ) {}

  ngOnInit(): void {
    console.log('Ruta actual:', this.route.snapshot.url);
    
    this.route.paramMap.subscribe(params => {
      if (params.has('idGrupo')) {
        this.idGrupo = params.get('idGrupo');
        console.log('ID del grupo recibido:', this.idGrupo);
        
        if (!this.idGrupo) {
          console.error('No se encontró el ID del grupo en la ruta');
          Swal.fire('Error', 'No se encontró el ID del grupo en la ruta.', 'error');
        } else {
          // Cargar datos cuando tenemos el ID del grupo
          this.loadData();
        }
      } else {
        console.error('La ruta no contiene el parámetro idGrupo');
        Swal.fire('Error', 'La ruta no contiene el parámetro idGrupo.', 'error');
      }
    });
  }

  loadData() {
    if (!this.idGrupo) {
      console.error('No se puede cargar datos sin ID del grupo');
      return;
    }

    console.log('Cargando datos para el ID:', this.idGrupo);
    
    // Simulación de llamado al servicio
    setTimeout(() => {
      console.log('Datos cargados con éxito');
    }, 1000);
  }
}
