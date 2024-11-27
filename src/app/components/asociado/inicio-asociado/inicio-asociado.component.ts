import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PersonasService } from 'src/app/services/personas.service';
import { SexoService } from 'src/app/services/sexo.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { EstadoCivilService } from 'src/app/services/estado-civil.service';
import { ParentescosService } from 'src/app/services/parentescos.service';
import { TiposPredioService } from 'src/app/services/tipos-predio.service';
import { VeredasService } from 'src/app/services/veredas.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Router } from '@angular/router';
import { FormasContactoAsociadoService } from 'src/app/services/formas-contacto-asociado-service.service';

@Component({
  selector: 'app-inicio-asociado',
  templateUrl: './inicio-asociado.component.html',
  styleUrls: ['./inicio-asociado.component.css'],
})
export class InicioAsociadoComponent implements OnInit {


  persona: any={};
  sexos: any[] = [];
  veredas: any[] = [];
  tiposDocumento: any[] = [];
  estadosCiviles: any[] = [];
  parentescos: any[] = [];
  tiposdepredios: any[] = [];
  produccion: any;
  familiares: any;
  permisos: any;
  activeTab: string = 'personal';
  showModal: boolean = false;

  constructor(
    private personasService: PersonasService,
    private sexoService: SexoService,
    private tipoDocumentoService: TipoDocumentoService,
    private estadoCivilService: EstadoCivilService,
    private parentescosService: ParentescosService,
    private tiposPredioService: TiposPredioService,
    private veredasService: VeredasService,
    private loadingService: LoadingService,
    private router: Router,
    private permisosService: FormasContactoAsociadoService
  ) { }

  ngOnInit(): void {
    this.loadingService.showLoading();
    const idUsuario = localStorage.getItem('identificador_usuario') || '';
    const idAsociado = localStorage.getItem('identificador_asociado') || '';
    const idAsociadoFinca = localStorage.getItem('identificador_asociado_finca') || '';
    const idPersona = localStorage.getItem('identificador_persona') || '';

    if (!idAsociado) {
      console.error('No se encontró idAsociado en el localStorage');
      this.loadingService.hideLoading();
      return;
    }

    this.personasService.getInfoOneAsociado(idAsociado).subscribe(
      (data) => {
        if (data) {
          if (data.produccion && data.produccion.length > 0) {
            this.produccion = data.produccion.slice(0, 100);
          }

          if (data.familiares && data.familiares.length > 0) {
            this.familiares = data.familiares.slice(0, 100);
          }

          if (data.asociado && data.asociado.length > 0) {
            this.persona = data.asociado[0];
          }

          if (data.permisos && data.permisos.length > 0) {
            this.permisos = data.permisos[0];
            this.checkHabeasData();
          }
        } else {
          console.error('No se encontró información relevante en la respuesta');
        }
        this.loadingService.hideLoading();
      },
      (error) => {
        console.error('Error al obtener la información del asociado', error);
        this.loadingService.hideLoading();
      }
    );

    this.tipoDocumentoService.getTiposDocumento().subscribe(
      (data) => {
        if (data) {
          this.tiposDocumento = data;
        }
        this.loadingService.hideLoading();
      },
      (error) => {
        console.error('Error al obtener los tipos de documento:', error);
        this.loadingService.hideLoading();
      }
    );

    this.sexoService.getSexos().subscribe(
      (data) => {
        if (data) {
          this.sexos = data;
        }
        this.loadingService.hideLoading();
      },
      (error) => {
        console.error('Error al obtener los sexos:', error);
        this.loadingService.hideLoading();
      }
    );

    this.veredasService.getVeredas().subscribe(
      (data) => {
        if (data) {
          this.veredas = data;
        }
        this.loadingService.hideLoading();
      },
      (error) => {
        console.error('Error al obtener las veredas:', error);
        this.loadingService.hideLoading();
      }
    );

    this.estadoCivilService.getEstadosCiviles().subscribe(
      (data) => {
        if (data) {
          this.estadosCiviles = data;
        }
        this.loadingService.hideLoading();
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
        this.loadingService.hideLoading();
      }
    );

    this.parentescosService.getParentescos().subscribe(
      (data) => {
        if (data) {
          this.parentescos = data;
        }
        this.loadingService.hideLoading();
      },
      (error) => {
        console.error('Error al obtener los parentescos:', error);
        this.loadingService.hideLoading();
      }
    );

    this.tiposPredioService.getPredio().subscribe(
      (data) => {
        if (data) {
          this.tiposdepredios = data;
        }
        this.loadingService.hideLoading();
      },
      (error) => {
        console.error('Error al obtener los tipos de predio:', error);
        this.loadingService.hideLoading();
      }
    );
  }

  checkHabeasData() {
    // Si el habeasData es 0, mostrar el modal
    if (this.permisos.habeasData === 0) {
      this.showModal = true;
    }
  }


  acceptTerms() {
    const idAsociado = localStorage.getItem('identificador_asociado') || '';
    const idPersona = localStorage.getItem('identificador_persona') || '';
    const categoria = this.permisos.categoria;
    const fotoAsociado = this.persona.fotoAsociado;


    if (idAsociado && idPersona) {
      this.permisosService.updatePermisoHabeasData(idAsociado, idPersona, true, categoria, fotoAsociado).subscribe(
        (data) => {
          this.showModal = false;
          // Aquí puedes agregar alguna acción adicional después de aceptar el habeas data.
          console.log('Habeas Data aceptado correctamente', data);
        },
        (error) => {
          console.error('Error al aceptar el habeas data', error);
        }
      );
    } else {
      console.error('No se encontraron los IDs de asociado o persona en el localStorage');
    }
  }


  rejectTerms() {
    // Si rechaza los términos, cerrar sesión y redirigir al home
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getTipoPredio(id: number): string {
    const tipoPredio = this.tiposdepredios.find((tp) => tp.id === id);
    return tipoPredio ? tipoPredio.tipo_predio : '';
  }

  getParentescos(id: number): string {
    const parentesco = this.parentescos.find((s) => s.id === id);
    return parentesco ? parentesco.parentesco : '';
  }

  getSexo(id: number): string {
    const sexo = this.sexos.find((s) => s.id === id);
    return sexo ? sexo.sexo : '';
  }

  getVeredas(id: number): string {
    const vereda = this.veredas.find((s) => s.id === id);
    return vereda ? vereda.vereda : '';
  }

  getTipoDocumento(id: number): string {
    const tipoDocumento = this.tiposDocumento.find((td) => td.id === id);
    return tipoDocumento ? tipoDocumento.tipo_documento : '';
  }

  getEstadoCivil(id: number): string {
    const estadoCivil = this.estadosCiviles.find((ec) => ec.id === id);
    return estadoCivil ? estadoCivil.estado_civil : '';
  }

  getEstado(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }

}
