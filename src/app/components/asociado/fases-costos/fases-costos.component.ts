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
  conceptos: any[] = [];
  activeTab: number = 0;
  selectedGrupo: number | null = null;  // Valor de la selección del grupo
  selectedConcepto: number | null = null; // Valor de la selección del concepto
  showForm: boolean = false;
  conceptoVisible: boolean = false; // Controla la visibilidad del select de conceptos

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
          console.log('Grupos de Conceptos cargados:', this.gruposConceptos);
        } else {
          console.error('No se encontraron grupos de conceptos');
        }
      },
      (error) => {
        console.error('Error al cargar los grupos de conceptos', error);
      }
    );
  }
  
  onSelectGrupo(grupoId: number | null): void {
    if (grupoId === null) return; // Ignorar si el valor es null
    this.selectedGrupo = grupoId;
    this.conceptoVisible = true;
    this.selectedConcepto = null;
    this.cargarConceptosPorGrupo(grupoId);
  }
  
  

  cargarConceptosPorGrupo(grupoId: number): void {
    this.calculoCostosService.getConceptosPorGrupo(grupoId).subscribe(
      (data: any) => {
        if (data && data.conceptos) {
          this.conceptos = data.conceptos;
        } else {
          console.error('No se encontraron conceptos para el grupo seleccionado');
        }
      },
      (error) => {
        console.error('Error al cargar los conceptos del grupo:', error);
      }
    );
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  onSubmit(): void {
    console.log('Grupo seleccionado:', this.selectedGrupo);
    console.log('Concepto seleccionado:', this.selectedConcepto);
    this.toggleForm();
  }

  selectTab(index: number): void {
    this.activeTab = index;
  }
}
