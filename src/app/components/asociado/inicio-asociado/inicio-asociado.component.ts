import { Component, OnInit , EventEmitter , Output } from '@angular/core';
import { PersonasService } from 'src/app/services/personas.service';
import { SexoService } from 'src/app/services/sexo.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { EstadoCivilService } from 'src/app/services/estado-civil.service';
import { ParentescosService } from 'src/app/services/parentescos.service';
import { TiposPredioService } from 'src/app/services/tipos-predio.service';
@Component({
  selector: 'app-inicio-asociado',
  templateUrl: './inicio-asociado.component.html',
  styleUrls: ['./inicio-asociado.component.css'],
})
export class InicioAsociadoComponent implements OnInit {


  @Output() openMenuEvent = new EventEmitter<void>();
  openMenu() {
    const menu = document.getElementById('menu');
    const overlay = document.getElementById('overlay');
    const menuBtn = document.getElementById('menu-btn');

    if (menu && overlay && menuBtn) {
      menu.classList.add('open');
      overlay.classList.add('active');
      menuBtn.classList.add('hidden');
    }
  }
  persona: any;
  sexos: any[] = [];
  tiposDocumento: any[] = [];
  estadosCiviles: any[] = [];
  produccion: any;
  familiares: any;
  parentescos: any[] = [];
  tiposdepredios: any[] = [];

  constructor(
    private personasService: PersonasService,
    private sexoService: SexoService,
    private tipoDocumentoService: TipoDocumentoService,
    private estadoCivilService: EstadoCivilService,
    private parentescosService: ParentescosService,
    private tiposPredioService: TiposPredioService
  ) {}

  ngOnInit(): void {
    const idUsuario = localStorage.getItem('identificador_usuario') || '';

    if (idUsuario) {
      this.personasService.getInfoOneAsociado(idUsuario).subscribe(
        (data) => {
          if (data && data.produccion && data.produccion.length > 0) {
            this.produccion = data.produccion.slice(0, 3);
          } else {
            console.error('No se encontraron personas en la respuesta');
          }
        },
        (error) => {
          console.error('Error al obtener persona', error);
        }
      );
    } else {
      console.error('No se encontró id_usuario en el localStorage');
    }

    if (idUsuario) {
      this.personasService.getInfoOneFamiliares(idUsuario).subscribe(
        (data) => {
          if (data && data.familiares && data.familiares.length > 0) {
            this.familiares = data.familiares.slice(0,3);
          } else {
            console.error('No se encontraron personas en la respuesta');
          }
        },
        (error) => {
          console.error('Error al obtener persona', error);
        }
      );
    } else {
      console.error('No se encontró id_usuario en el localStorage');
    }

    if (idUsuario) {
      this.personasService.getPersona(idUsuario).subscribe(
        (data) => {
          if (data && data.personas && data.personas.length > 0) {
            this.persona = data.personas[0];
          } else {
            console.error('No se encontraron personas en la respuesta');
          }
        },
        (error) => {
          console.error('Error al obtener persona', error);
        }
      );
    } else {
      console.error('No se encontró id_usuario en el localStorage');
    }
    this.tipoDocumentoService.getTiposDocumento().subscribe(
      (data) => {
        if (data) {
          this.tiposDocumento = data;
        }
      },
      (error) => {
        console.error('Error al obtener los tipos de documento:', error);
      }
    );
    this.sexoService.getSexos().subscribe(
      (data) => {
        if (data) {
          this.sexos = data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );
    this.estadoCivilService.getEstadosCiviles().subscribe(
      (data) => {
        if (data) {
          this.estadosCiviles = data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );

    this.parentescosService.getParentescos().subscribe(
      (data) => {
        if (data) {
          this.parentescos = data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );

    this.tiposPredioService.getPredio().subscribe(
      (data) => {
        if (data) {
          this.tiposdepredios = data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );
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
