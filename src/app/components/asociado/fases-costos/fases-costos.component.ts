import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalculodecostosService } from 'src/app/services/calculodecostos.service';

@Component({
  selector: 'app-fases-costos',
  templateUrl: './fases-costos.component.html',
  styleUrls: ['./fases-costos.component.css']
})
export class FasesCostosComponent implements OnInit {
  idGrupo: string | null = null;
  fasesProducion: any[] = [];
  gruposConceptos: any[] = [];
  activeTab: number = 0;
  selectedGrupo: number | null = null;

  // Controla la visibilidad del modal
  showForm: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private calculoCostosService: CalculodecostosService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has('idGrupo')) {
        this.idGrupo = params.get('idGrupo');
        this.cargarFases();
      }
    });
    this.cargarGruposConceptos();
  }

  cargarFases(): void {
    if (!this.idGrupo) return;

    this.calculoCostosService.getFasesProduccion(this.idGrupo).subscribe(
      (data: any) => {
        if (data && Array.isArray(data.fases_produccion)) {
          this.fasesProducion = data.fases_produccion;
        } else {
          console.error('No se encontraron fases de producción');
        }
      },
      (error: any) => {
        console.error('Error al cargar las fases:', error);
      }
    );
  }

  cargarGruposConceptos(): void {
    this.calculoCostosService.getGruposConceptos().subscribe(
      (data: any) => {
        if (data && data.grupos_conceptos) {
          this.gruposConceptos = data.grupos_conceptos;
          console.log('Grupos de Conceptos cargados:', this.gruposConceptos); // Verifica la carga de datos
        } else {
          console.error('No se encontraron grupos de conceptos');
        }
      },
      (error) => {
        console.error('Error al cargar los grupos de conceptos', error);
      }
    );
  }
  
  // Método para manejar el cambio de selección
  onSelectGrupo(grupoId: number): void {
    this.selectedGrupo = grupoId;
  }

  // Método para alternar la visibilidad del modal
  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  // Método para enviar el formulario
  onSubmit(): void {
    console.log('Grupo seleccionado:', this.selectedGrupo);
    // Aquí puedes realizar lo que necesites con el grupo seleccionado
    this.toggleForm(); // Cerrar el modal después de enviar el formulario
  }

  // Método para cambiar la pestaña activa
  selectTab(index: number): void {
    this.activeTab = index;
  }
}
