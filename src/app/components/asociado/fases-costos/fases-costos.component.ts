import { Component, OnInit , EventEmitter, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalculodecostosService } from 'src/app/services/calculodecostos.service';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'; 
const EXCEL_EXTENSION = '.xlsx';
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

  isSubmitting: boolean = false;
  formattedValorUnitario: string= '';

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
    this.resetForm();
    this.selectedGrupo = 0;
    this.selectedConcepto = 0;
    this.cantidad = 0;
    this.detalle = "";
    this.valorUnitario = 0;
    this.formattedValorUnitario = ''; // También reinicia el valor formateado
    this.showForm = !this.showForm;
  }

  onSelectConcepto(conceptoId: number): void {
    this.selectedConcepto = conceptoId;

    const selectedConcepto = this.conceptos.find(c => c.id === conceptoId);
    if (selectedConcepto) {
      this.cantidad = selectedConcepto.cantidad || 0;
      this.valorUnitario = selectedConcepto.valorUnitario || 0; // Asegúrate de manejar casos no definidos
      this.formattedValorUnitario = this.formatNumber(String(this.valorUnitario)); // Formatea si es necesario
    } else {
      this.cantidad = 0;
      this.valorUnitario = 0;
      this.formattedValorUnitario = '';
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

  deleteConcepto(idDetallado: any) {
    // Mostrar el alert de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminado, no podrás recuperar este concepto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      // Si el usuario confirma
      if (result.isConfirmed) {
        console.log("IdDetallado: ", idDetallado);
        // Llamar al servicio de eliminación
        this.calculoCostosService.deleteDetalladoProduccion({ id: idDetallado }).subscribe(
          response => {
            Swal.fire('Éxito', 'Concepto borrado correctamente.', 'success');
            this.ngOnInit();
          },
          error => {
            Swal.fire('Error', 'No se pudo borrar el concepto.', 'error');
          }
        );
      }
    });
  }

  // Función que se ejecuta al escribir en el input
  onInputChange(event: any) {
    const rawValue = event.target.value.replace(/\./g, ''); // Eliminar los puntos
    this.formattedValorUnitario = this.formatNumber(rawValue); // Formatear el valor visual
    this.valorUnitario = rawValue; // Guardar el valor real sin formato
  }

  // Función para agregar puntos de mil
  formatNumber(value: string): string {
    if (value) {
      // Formatear el número agregando puntos cada tres dígitos
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return value;
  }

  onSubmit(): void {
    // Verifica si ya hay una solicitud en proceso
    if (this.isSubmitting) {
      return; // Evita ejecutar el código de guardado nuevamente
    }

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

    // Bloquea el botón para evitar más clics
    this.isSubmitting = true;

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
        this.resetForm();
        this.showForm = false;
        if (this.idHojaCostos) {
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
      },
      () => {
        // Habilita el botón nuevamente después de completar la solicitud
        this.isSubmitting = false;
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
      const workbook = new ExcelJS.Workbook();
      const wsGeneral = workbook.addWorksheet('Hoja de Costos Generales');
      const wsFases = workbook.addWorksheet('Fases'); // Nueva hoja para las fases
  
      // Ajustar el ancho de las columnas en la hoja general
      wsGeneral.columns = [
          { width: 60 },
          { width: 10 },
          { width: 30 }
      ];
  
      // Ajustar el ancho de las columnas en la hoja de fases
      wsFases.columns = [
          { width: 40 }, // Ancho para la columna "Fase"
          { width: 30 }  // Ancho para la columna "Subtotales"
      ];
  
      // Cargar logo desde archivo local
      fetch('/assets/imagenes/logo_anuc.png')
          .then(response => response.blob())
          .then(blob => {
              const reader = new FileReader();
              reader.onload = () => {
                  const base64Logo = reader.result as string;
                  const logoId = workbook.addImage({
                      base64: base64Logo,
                      extension: 'png',
                  });
  
                  // Configurar hoja general
                  const titleRow = wsGeneral.addRow([
                      'ASOCIACION MUNICIPAL DE USUARIOS CAMPESINOS DE FLORIDABLANCA\nNIT: 890.211.458-4',
                      '',
                      ''
                  ]);
                  titleRow.height = 100;
                  wsGeneral.mergeCells('A1:C1');
                  wsGeneral.getCell('A1').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                  wsGeneral.getCell('A1').font = { bold: true, size: 14, color: { argb: '000000' } };
                  wsGeneral.getCell('A1').fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'F2F2F2' }
                  };
                  wsGeneral.getCell('A1').border = {
                      top: { style: 'thin' },
                      left: { style: 'thin' },
                      bottom: { style: 'thin' },
                      right: { style: 'thin' }
                  };
  
                  wsGeneral.addImage(logoId, {
                      tl: { col: 2.99, row: 0.5 },
                      ext: { width: 100, height: 60 }
                  });
  
                  const headerRow = wsGeneral.addRow(['Descripción', 'Valor', '']);
                  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                      if (colNumber <= 3) {
                          cell.font = { bold: true, color: { argb: 'FFFFFF' } };
                          cell.fill = {
                              type: 'pattern',
                              pattern: 'solid',
                              fgColor: { argb: '007bff' }
                          };
                          cell.border = {
                              top: { style: 'thin' },
                              left: { style: 'thin' },
                              bottom: { style: 'thin' },
                              right: { style: 'thin' }
                          };
                          cell.alignment = { vertical: 'middle', horizontal: 'center' };
                      }
                  });
                  wsGeneral.mergeCells('B2:C2');
  
                  const data = [
                      ['Fecha Inicio', this.datosHoja[0].fechaInicio, ''],
                      ['Fecha Fin', this.datosHoja[0].fechaFin, ''],
                      ['Producto', this.datosHoja[0].producto, ''],
                      ['Descripción', this.datosHoja[0].descripcion, ''],
                      ['Hectáreas o Animales a Trabajar', this.datosHoja[0].cantidad, ''],
                      ['Cantidad Esperada', this.datosHoja[0].esperado, ''],
                      ['Unidad de Producción', this.datosHoja[0].unidad, ''],
                      ['Total Costo', this.datosHoja[this.datosFlag].totalcosto, ''],
                      ['Costo por Unidad de Producción', this.datosHoja[this.datosFlag].costounidad, '']
                  ];
  
                  data.forEach(item => {
                      const row = wsGeneral.addRow(item);
                      row.height = 30;
                      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                          if (colNumber <= 3) {
                              cell.border = {
                                  top: { style: 'thin' },
                                  left: { style: 'thin' },
                                  bottom: { style: 'thin' },
                                  right: { style: 'thin' }
                              };
                              cell.fill = {
                                  type: 'pattern',
                                  pattern: 'solid',
                                  fgColor: { argb: 'F2F2F2' }
                              };
                              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                          }
                      });
                      wsGeneral.mergeCells(`B${row.number}:C${row.number}`);
                  });
  
                  // Configurar la hoja de fases con encabezado
                  const faseTitleRow = wsFases.addRow([
                      'ASOCIACION MUNICIPAL DE USUARIOS CAMPESINOS DE FLORIDABLANCA\nNIT: 890.211.458-4'
                  ]);
                  faseTitleRow.height = 60;
                  wsFases.mergeCells('A1:B1');
                  wsFases.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                  wsFases.getCell('A1').font = { bold: true, size: 14, color: { argb: '000000' } };
                  wsFases.getCell('A1').fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'F2F2F2' }
                  };
                  wsFases.getCell('A1').border = {
                      top: { style: 'thin' },
                      left: { style: 'thin' },
                      bottom: { style: 'thin' },
                      right: { style: 'thin' }
                  };
  
                  wsFases.addImage(logoId, {
                      tl: { col: 1.8, row: 0.4},
                      ext: { width: 100, height: 60 }
                  });
  
                  const faseHeaderRow = wsFases.addRow(['Fase', 'Subtotales']);
                  faseHeaderRow.eachCell((cell, colNumber) => {
                      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
                      cell.fill = {
                          type: 'pattern',
                          pattern: 'solid',
                          fgColor: { argb: '007bff' }
                      };
                      cell.border = {
                          top: { style: 'thin' },
                          left: { style: 'thin' },
                          bottom: { style: 'thin' },
                          right: { style: 'thin' }
                      };
                      cell.alignment = { vertical: 'middle', horizontal: 'center' };
                  });
  
                  const faseData = [
                      ...this.datosTablas.map(row => [row.nombreFase, row.acumuladoFase]),
                      ['Total Costo', this.datosHoja[this.datosFlag].totalcosto],
                      ['Costo por Unidad de Producción', this.datosHoja[this.datosFlag].costounidad]
                  ];
  
                  faseData.forEach(item => {
                      const row = wsFases.addRow(item);
                      row.height = 30;
                      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                          cell.border = {
                              top: { style: 'thin' },
                              left: { style: 'thin' },
                              bottom: { style: 'thin' },
                              right: { style: 'thin' }
                          };
                          cell.fill = {
                              type: 'pattern',
                              pattern: 'solid',
                              fgColor: { argb: 'F2F2F2' }
                          };
                          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                      });
                  });
  
                  // Generar archivo Excel
                  workbook.xlsx.writeBuffer().then(data => {
                      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                      FileSaver.saveAs(blob, 'HojaDeCostos_export_' + new Date().getTime() + '.xlsx');
                  });
              };
              reader.readAsDataURL(blob);
          })
          .catch(error => {
              console.error('Error al cargar el logo:', error);
          });
  }
  
  
  
}    