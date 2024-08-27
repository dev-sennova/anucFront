import { Component, OnInit } from '@angular/core';
import { EstadoCivilService } from 'src/app/services/estado-civil.service';
import { SexoService } from 'src/app/services/sexo.service';
import { PersonasService } from 'src/app/services/personas.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { InicioComponent } from '../../administrador/inicio/inicio.component';

@Component({
  selector: 'app-edit-datos',
  templateUrl: './edit-datos.component.html',
  styleUrls: ['./edit-datos.component.css'],
})
export class EditDatosComponent implements OnInit {
  persona: any;
  filteredPersonas: any[] = [];
  paginatedPersonas: any[] = [];
  estadosCiviles: any[] = [];
  tipoDocumentos: any[] = [];
  sexos: any[] = [];
  idUsuarioCargado: any;
  nombresUsuarioCargado: any;
  apellidosUsuarioCargado: any;
  identificacionUsuarioCargado: any;
  telefonoUsuarioCargado: any;
  sexo: any;
  selectedPersona: any = {};
  editModalVisible: boolean = false;
  roles: any;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  totalRegistros: number = 0;

  constructor(
    public router: Router,
    private estadoCivilService: EstadoCivilService,
    private tipoDeDocumentoService: TipoDocumentoService,
    private sexoService: SexoService,
    private personasService: PersonasService
    
  ) {}
  ngOnInit(): void {
    const idUsuario = localStorage.getItem('identificador_usuario') || '';
    this.idUsuarioCargado = localStorage.getItem('identificador_usuario');
    this.nombresUsuarioCargado = localStorage.getItem('nombre_usuario');
    this.apellidosUsuarioCargado = localStorage.getItem('apellido_usuario');
    this.identificacionUsuarioCargado =
      localStorage.getItem('documento_usuario');
    this.telefonoUsuarioCargado = localStorage.getItem('telefono');
    this.roles = localStorage.getItem('roles');
    //
    console.log('IdUsuario cargado: ' + this.idUsuarioCargado);
    console.log('NombresUsuario cargado: ' + this.nombresUsuarioCargado);
    console.log('ApellidosUsuario cargado: ' + this.apellidosUsuarioCargado);
    console.log(
      'IdentificacionUsuario cargado: ' + this.identificacionUsuarioCargado
    );
    console.log('TelefonoUsuario cargado: ' + this.telefonoUsuarioCargado);
    console.log('RolesUsuario cargado: ' + JSON.stringify(this.roles));

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

    this.tipoDeDocumentoService.getTiposDocumento().subscribe(
      (data) => {
        if (data) {
          this.tipoDocumentos = data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
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
    if (idUsuario) {
      this.personasService.getPerson(idUsuario).subscribe(
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
    this.tipoDeDocumentoService.getTiposDocumento().subscribe(
      (data) => {
        if (data) {
          this.tipoDocumentos = data;
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
  }

  getSexo(id: number): string {
    const sexo = this.sexos.find((s) => s.id === id);
    return sexo ? sexo.sexo : '';
  }

  getTipoDocumento(id: number): string {
    const tipoDocumento = this.tipoDocumentos.find((td) => td.id === id);
    return tipoDocumento ? tipoDocumento.tipo_documento : '';
  }

  getEstadoCivil(id: number): string {
    const estadoCivil = this.estadosCiviles.find((ec) => ec.id === id);
    return estadoCivil ? estadoCivil.estado_civil : '';
  }
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPersonas.length / this.itemsPerPage);
    this.paginatedPersonas = this.filteredPersonas.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    this.totalRegistros = this.filteredPersonas.length;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  openEditModal(personas: any): void {
    this.selectedPersona = { ...personas };
    this.editModalVisible = true;
  }

  closeEditModal(): void {
    this.editModalVisible = false;
  }

  submitEditForm(): void {
    this.personasService.updatePersona(this.persona).subscribe(
      
      (response) => {
        Swal.fire('¡Éxito!', 'Persona actualizada correctamente.', 'success');
        this.router.navigate(['asociado/inicio-asociado']);
      },
      (error) => {
        Swal.fire('Error', 'No se pudo actualizar la persona.', 'error');
        console.error(error);
      }
    );
}

}
