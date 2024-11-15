import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalculodecostosService } from 'src/app/services/calculodecostos.service';
import Swal from 'sweetalert2';

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
  selectedGrupo: number = 0;
  selectedConcepto: number = 0;
  showForm: boolean = false;
  cantidad: number = 0;
  valorUnitario: number = 0;
  selectedPhaseId: number | null = null;
  costos: any[] = []; // Almacena los costos obtenidos

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
    this.cargarCostos();
  }

  cargarFases(): void {
    if (!this.idGrupo) return;

    this.calculoCostosService.getFasesProduccion(this.idGrupo).subscribe(
      (data: any) => {
        if (data && Array.isArray(data.fases_produccion)) {
          this.fasesProducion = data.fases_produccion;
          this.selectedPhaseId=this.fasesProducion[0].id;
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

  onSelectGrupo(grupoId: number): void {
    console.log("Valor select cargado: ", grupoId);
    this.selectedGrupo = grupoId;
    this.selectedConcepto = 0;
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
    this.selectedGrupo = 0;
    this.selectedConcepto = 0;
    this.showForm = !this.showForm;
  }

  onSelectConcepto(conceptoId: number): void {
    this.selectedConcepto = conceptoId;

    const selectedConcepto = this.conceptos.find(c => c.id === conceptoId);
    if (selectedConcepto) {
      this.cantidad = selectedConcepto.cantidad;
      this.valorUnitario = selectedConcepto.valorUnitario;
    }
  }

  selectTab(index: number): void {
    this.activeTab = index;
    this.selectedPhaseId = this.fasesProducion[index].id; // Asigna el ID de la fase seleccionada
    console.log("Fase seleccionada con ID:", this.selectedPhaseId); // Mostrar el ID de la fase seleccionada
  }

  onSubmit(): void {
    // Validación de campos
    if (
      !this.selectedGrupo ||
      !this.selectedConcepto ||
      !this.selectedPhaseId ||
      !this.cantidad ||
      this.cantidad <= 0 ||
      !this.valorUnitario ||
      this.valorUnitario <= 0
    ) {
      // Mostrar alerta con SweetAlert
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Todos los campos son obligatorios. La cantidad y el valor unitario deben ser mayores a cero.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
  
    // Preparar datos para envío
    const formData = {
      idGrupo: this.selectedGrupo,
      idConcepto: this.selectedConcepto,
      idFase: this.selectedPhaseId,
      idHojaCostos: this.idGrupo,
      cantidad: this.cantidad,
      valorUnitario: this.valorUnitario,
    };
  
    console.log('Datos del formulario:', formData);
  
    // Enviar datos al servicio
    this.calculoCostosService.storeDetalladoProduccion(formData).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
  
        // Mostrar confirmación
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Los datos se han guardado correctamente.',
          confirmButtonText: 'Aceptar',
        });
      },
      (error: any) => {
        console.error('Error al guardar:', error);
  
        // Mostrar error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al guardar los datos. Por favor, intenta nuevamente.',
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }

  cargarCostos(): void {
    if (this.idGrupo) {
      const idGrupoNumerico = Number(this.idGrupo); // Conversión a número
      this.calculoCostosService.obtenerCosteo(idGrupoNumerico).subscribe(
        (data: any) => {
          if (data && Array.isArray(data)) {
            this.costos = data; // Asigna los datos obtenidos
          } else {
            this.costos = [];
            console.warn('No se encontraron datos en el costeo.');
          }
        },
        (error: any) => {
          console.error('Error al cargar los costos:', error);
        }
      );
    } else {
      console.error('El idGrupo no está definido.');
    }
  }
  editar(item: any): void {
    // Lógica para editar el elemento.
    console.log('Elemento para editar:', item);
    // Puedes agregar aquí más lógica para manejar la edición, como abrir un modal.
  }
}

