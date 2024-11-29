import { Component, OnInit , EventEmitter, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalculodecostosService } from 'src/app/services/calculodecostos.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

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
  detalle: string = "";
  valorUnitario: number = 0;
  selectedPhaseId: number | null = null;
  idHojaCostos: string | null = null;
  datosHoja: any[] = [];
  datosTabla: any[] = [];
  datosTablas: any[] = [];
  datosSecciones1: any[] = [];
  datosSecciones2: any[] = [];
  datosSecciones3: any[] = [];
  seccionesCarga1: any[] = [];
  seccionesCarga2: any[] = [];
  seccionesCarga3: any[] = [];
  datosFiltrados: any;
  seccionesFiltradas1: any;
  seccionesFiltradas2: any;
  seccionesFiltradas3: any;

  TotalCostos: any[] = [];
  datosFlag: number=0;

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

      if (params.has('idHojaCostos')) {
        this.idHojaCostos = params.get('idHojaCostos');
        console.log("Id Hoja de costos:",this.idHojaCostos);
        this.obtenerDatosHojaCostos(Number(this.idHojaCostos));
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
          this.selectedPhaseId = this.fasesProducion[0].id;
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
    this.selectedPhaseId = this.fasesProducion[index]?.id || null;
    console.log("Fase seleccionada con ID:", this.selectedPhaseId);

    // Llama a vectorTabla solo si hay un ID de fase seleccionado
    if (this.selectedPhaseId !== null) {
      this.vectorTabla(this.selectedPhaseId, this.datosTablas);
    } else {
      this.datosTabla = [];
      this.datosSecciones1 = [];
      this.datosSecciones2 = [];
      this.datosSecciones3 = [];
    }
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
      idHojaCostos: this.idHojaCostos,
      cantidad: this.cantidad,
      detalle: this.detalle,
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
        this.showForm = false;
        this.resetForm();
        if (this.idHojaCostos){
          this.obtenerDatosHojaCostos(Number(this.idHojaCostos));
        }
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

  // Método para resetear los valores del formulario
  resetForm(): void {
    this.selectedGrupo = 0;
    this.selectedConcepto = 0;
    this.cantidad = 0;
    this.detalle = "";
    this.valorUnitario = 0;
  }

  obtenerDatosHojaCostos(idHojaCostos: number): void {
    this.calculoCostosService.obtenerCosteo(idHojaCostos).subscribe(
      (response: any) => {
        if (response.estado === 'Ok') {
          console.log('Detallado inicial Hoja:', response);

          const { fechaInicio, fechaFin, descripcion, unidad, cantidad, detalle, esperado, producto, totalcosto, costounidad } = response;
          this.datosHoja.push({ fechaInicio, fechaFin, descripcion, unidad, cantidad, detalle, esperado, producto, totalcosto, costounidad });

          this.datosFlag=this.datosHoja.length - 1;

          console.log('Vector Hoja fase 0:', this.datosHoja);
          console.log('Vector Hoja Acumulado:', this.datosHoja[this.datosFlag].totalcosto);
          console.log('Vector Hoja Unidad:', this.datosHoja[this.datosFlag].costounidad);

          this.datosTablas = response.detallado_hoja;
          this.vectorTabla(this.selectedPhaseId, this.datosTablas);
        } else {
          console.error('Error en la respuesta:', response.message);
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  vectorTabla(fase: any, objeto: any) {
    // Inicializa la tabla en blanco para evitar que se muestren datos anteriores
    this.datosTabla = [];
    this.datosSecciones1 = [];
    this.datosSecciones2 = [];
    this.datosSecciones3 = [];
    this.seccionesCarga1 = [];
    this.seccionesCarga2 = [];
    this.seccionesCarga3 = [];

    // Filtrar el objeto para obtener solo los datos que coincidan con el idFase
    this.datosFiltrados = objeto.filter((item: any) => item.idFase === fase);

    if (this.datosFiltrados.length > 0) {
      this.datosTabla = this.datosFiltrados[0]; // Asigna el primer elemento encontrado
      console.log('Datos filtrados:', this.datosTabla);
      this.vectorSecciones(this.datosTabla);
    } else {
      // Si no se encuentran datos para la fase, asegurarse de limpiar las secciones también
      console.warn('No se encontraron datos para la fase:', fase);
      this.datosTabla = [];
      this.datosSecciones1 = [];
      this.datosSecciones2 = [];
      this.datosSecciones3 = [];
      this.seccionesCarga1 = [];
      this.seccionesCarga2 = [];
      this.seccionesCarga3 = [];
    }
  }

  vectorSecciones(datosFiltrados: any) {
    this.datosSecciones1 = [];
    this.datosSecciones2 = [];
    this.datosSecciones3 = [];

    // Asegurarse de que `gruposConceptos` existe antes de filtrar
    if (!datosFiltrados.gruposConceptos) {
      console.warn('No hay gruposConceptos para la fase seleccionada.');
      this.datosSecciones1 = [];
      this.datosSecciones2 = [];
      this.datosSecciones3 = [];
      return;
    }

    // Filtrar el array `gruposConceptos` para obtener las diferentes secciones
    this.seccionesFiltradas1 = datosFiltrados.gruposConceptos.filter((item: any) => item.idGrupoConcepto === 1);
    this.seccionesFiltradas2 = datosFiltrados.gruposConceptos.filter((item: any) => item.idGrupoConcepto === 2);
    this.seccionesFiltradas3 = datosFiltrados.gruposConceptos.filter((item: any) => item.idGrupoConcepto === 3);

    // Asignar los datos filtrados a los arrays correspondientes
    this.datosSecciones1 = this.seccionesFiltradas1.length > 0 ? this.seccionesFiltradas1[0] : [];
    this.datosSecciones2 = this.seccionesFiltradas2.length > 0 ? this.seccionesFiltradas2[0] : [];
    this.datosSecciones3 = this.seccionesFiltradas3.length > 0 ? this.seccionesFiltradas3[0] : [];

    this.seccionesCarga1 = this.seccionesFiltradas1.length > 0 ? this.seccionesFiltradas1[0].agrupado_hoja : [];
    this.seccionesCarga2 = this.seccionesFiltradas2.length > 0 ? this.seccionesFiltradas2[0].agrupado_hoja : [];
    this.seccionesCarga3 = this.seccionesFiltradas3.length > 0 ? this.seccionesFiltradas3[0].agrupado_hoja : [];

    // Mostrar en consola para verificar
    console.log('Secciones filtradas 1:', this.datosSecciones1);
    console.log('Secciones filtradas 2:', this.datosSecciones2);
    console.log('Secciones filtradas 3:', this.datosSecciones3);

    // Mostrar en consola para verificar
    console.log('Secciones carga 1:', this.seccionesCarga1);
    console.log('Secciones carga 2:', this.seccionesCarga2);
    console.log('Secciones carga 3:', this.seccionesCarga3);
    this.TotalCostos.push({
      faseId: datosFiltrados.idFase,  // ID de la fase
      seccion1: this.datosSecciones1,
      seccion2: this.datosSecciones2,
      seccion3: this.datosSecciones3,
      subtotal1: this.getTotalAcumulado(this.seccionesCarga1),
      subtotal2: this.getTotalAcumulado(this.seccionesCarga2),
      subtotal3: this.getTotalAcumulado(this.seccionesCarga3),
    });

    // Mostrar el contenido acumulado en TotalCostos
    console.log('Total de costos acumulado hasta el momento:', this.TotalCostos);
  }


  getTotalAcumulado(seccion: any[]): number {
    return seccion.reduce((total, item) => total + item.subtotal, 0);
    }


    getNombreSeccion(index: number): string {
      // Asegúrate de ordenar los grupos de conceptos por 'id' (o cualquier otro criterio) cada vez que se llame
      const gruposOrdenados = this.gruposConceptos.sort((a: any, b: any) => a.id - b.id);  // Ordena por id, ajusta si necesitas otro campo

      // Verifica si existen los datos de gruposConceptos para el índice
      const grupo = gruposOrdenados[index];

      if (grupo) {
        return grupo.grupo || `Sección ${index + 1}`; // Retorna el nombre del grupo, o "Sección X" como predeterminado
      } else {
        return `Sección ${index + 1}`;  // Predeterminado si no existe el grupo
      }
    }

      exportToExcel(): void {
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // Hoja de costos generales
        const generalData = [
          ['ASOCIACION MUNICIPAL DE USUARIOS CAMPESINOS DE FLORIDABLANCA', ''],
          ['NIT: 890.211.458-4', ''],
          [''],
          ['Fecha Inicio', this.datosHoja[0].fechaInicio],
          ['Fecha Fin', this.datosHoja[0].fechaFin],
          ['Producto', this.datosHoja[0].producto],
          ['Descripción', this.datosHoja[0].descripcion],
          ['Hectáreas o Animales a Trabajar', this.datosHoja[0].cantidad],
          ['Cantidad Esperada', this.datosHoja[0].esperado],
          ['Unidad de Producción', this.datosHoja[0].unidad],
          ['Total Costo', this.datosHoja[this.datosFlag].totalcosto],
          ['Costo por Unidad de Producción', this.datosHoja[this.datosFlag].costounidad]
        ];

        const wsGeneral: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(generalData);

        // Aplicar bordes y formato de celdas
        const range = XLSX.utils.decode_range(wsGeneral['!ref']!);
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address = { c: C, r: R };
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            if (!wsGeneral[cell_ref]) wsGeneral[cell_ref] = { t: 's', v: '' };
            if (!wsGeneral[cell_ref].s) wsGeneral[cell_ref].s = {};
            wsGeneral[cell_ref].s.border = {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            };
            // Aplicar formato de decimales a las celdas numéricas
            if (C === 1 && R > 3) { // Columna 2 (índice 1) y fila mayor a 3 para datos numéricos
              wsGeneral[cell_ref].z = '0.00';
            }
          }
        }

        XLSX.utils.book_append_sheet(wb, wsGeneral, 'Hoja de Costos Generales');

        // Detalle de costos por fases
        const faseData = [
          ['Fase', 'Subtotales'],
          ...this.datosTablas.map(row => [row.nombreFase, row.acumuladoFase]),
          ['Total Costo', this.datosHoja[0].totalcosto],
          ['Costo por Unidad de Producción', this.datosHoja[0].costounidad]
        ];

        const wsFases: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(faseData);

        // Aplicar bordes y formato de celdas
        const rangeFases = XLSX.utils.decode_range(wsFases['!ref']!);
        for (let R = rangeFases.s.r; R <= rangeFases.e.r; ++R) {
          for (let C = rangeFases.s.c; C <= rangeFases.e.c; ++C) {
            const cell_address = { c: C, r: R };
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            if (!wsFases[cell_ref]) wsFases[cell_ref] = { t: 's', v: '' };
            if (!wsFases[cell_ref].s) wsFases[cell_ref].s = {};
            wsFases[cell_ref].s.border = {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            };
            // Aplicar formato de decimales a las celdas numéricas
            if (C === 1 && R > 0) { // Columna 2 (índice 1) y fila mayor a 0 para datos numéricos
              wsFases[cell_ref].z = '0.00';
            }
          }
        }

        XLSX.utils.book_append_sheet(wb, wsFases, 'Detalle de Costos por Fases');

        // Generar archivo Excel y guardar
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'HojaDeCostos');
      }

      private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
    }

    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
