import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EstadoCivilService } from 'src/app/services/estado-civil.service';
import { FamiliaresService } from 'src/app/services/familiares.service';
import { OfertasAsociadoService } from 'src/app/services/ofertas-asociado.service';
import { ParentescosService } from 'src/app/services/parentescos.service';
import { PersonasService } from 'src/app/services/personas.service';
import { ProductosCategoriasService } from 'src/app/services/productos-categorias.service';
import { SexoService } from 'src/app/services/sexo.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { UnidadesMedidaService } from 'src/app/services/unidades-medida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-nucleo-familiar',
  templateUrl: './gestionar-nucleo-familiar.component.html',
  styleUrls: ['./gestionar-nucleo-familiar.component.css']
})
export class GestionarNucleoFamiliarComponent {

  familiares: any[] = [];
  parentescos: any[] = [];
  estadosCiviles: any[] = [];
  sexos: any[] = [];
  tiposDocumento: any[] = [];
  createModalVisible: boolean = false;
  editModalVisible: boolean = false;
  selectedFamiliar: any = {};
  newFamiliar: any = {};
  deactivateModalVisible: boolean = false;


  constructor(
    private personasService: PersonasService,
    private sexoService: SexoService,
    private estadocivilService: EstadoCivilService,
    private tipodocumentoService: TipoDocumentoService,
    private parentescoService: ParentescosService,
    private familiaresService: FamiliaresService

  ) { }

  ngOnInit(): void {
    const idUsuario = localStorage.getItem('identificador_asociado') || '';

    this.personasService.getInfoOneFamiliares(idUsuario).subscribe(
      data => {
        if (data && data.estado === 'Ok') {
          this.familiares = data.familiares;
        } else {
          Swal.fire('Error', 'No se pudieron cargar los familiares.', 'error');
        }
      },
      error => {
        Swal.fire('Error', 'Error al obtener los familiares.', 'error');
      }
    );


    this.estadocivilService.getEstadosCiviles().subscribe(
      (data) => {
        if (data) {
          this.estadosCiviles = data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );

    this.parentescoService.getParentescos().subscribe(
      (data) => {
        if (data) {
          this.parentescos = data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );

    this.tipodocumentoService.getTiposDocumento().subscribe(
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
  }


  openCreateModal(): void {
    this.  newFamiliar = {
      nombres: '',
      apellidos: '',
      identificacion: '',
      telefono: '',
      fecha_nacimiento: '',
      tipo_documento: '',
      sexo: '',
      estado_civil: '',
      parentesco: ''
  };
  ;
    this.createModalVisible = true;
  }

  closeCreateModal(): void {
    this.createModalVisible = false;
  }

  submitCreateForm(): void {
    
    this.personasService.addPersona(this.newFamiliar).subscribe(
      (response: any) => {
        const personaId = response.id; // Asegúrate de que el ID de la persona creada se reciba en la respuesta
        const idUsuario = localStorage.getItem('identificador_asociado') || ''; // Obtener el ID del asociado (usuario)
        const parentescoId = this.newFamiliar.parentesco; // Obtener el parentesco seleccionado

        // Segundo paso: asignar la persona al asociado
        this.asociarFamiliarAlAsociado(personaId, idUsuario, parentescoId);
      },
      error => {
        Swal.fire('Error', 'No se pudo agregar la persona.', 'error');
      }
    );
  }

  asociarFamiliarAlAsociado(personaId: number, asociadoId: string, parentescoId: number): void {
    const asignacion = {
      asociado: asociadoId,
      persona: personaId,
      parentesco: parentescoId
    };

    this.familiaresService.addFamiliar(asignacion).subscribe(
      response => {
        Swal.fire('Éxito', 'Familiar asignado correctamente.', 'success');
        this.closeCreateModal();
        this.ngOnInit();
      },
      error => {
        Swal.fire('Error', 'No se pudo asignar la persona al asociado.', 'error');
      }
    );
  }
  
  openEditModal(familiar: any): void {
    this.selectedFamiliar = { ...familiar };
    this.editModalVisible = true;
  }

  closeEditModal(): void {
    this.editModalVisible = false;
  }

  submitEditForm(): void {
    const personaToUpdate = {
      id: this.selectedFamiliar.persona, 
      identificacion: this.selectedFamiliar.identificacion,
      nombres: this.selectedFamiliar.nombres,
      apellidos: this.selectedFamiliar.apellidos,
      telefono: this.selectedFamiliar.telefono,
      fecha_nacimiento: this.selectedFamiliar.fecha_nacimiento,
      tipo_documento: this.selectedFamiliar.tipo_documento,
      sexo: this.selectedFamiliar.sexo,
      estado_civil: this.selectedFamiliar.estado_civil, 
    };

    this.personasService.updatePersona(personaToUpdate).subscribe(
      (response: any) => {
        const personaId = response.id || this.selectedFamiliar.persona;  
        const idUsuario = localStorage.getItem('identificador_asociado') || '';  
        const parentescoId = this.selectedFamiliar.parentesco;
        const familiarId = this.selectedFamiliar.idFamiliar;  

        
        this.editarFamiliarAsociado(personaId, idUsuario, parentescoId, familiarId);
      },
      error => {
        Swal.fire('Error', 'No se pudo actualizar la persona.', 'error');
      }
    );
  }
  
  editarFamiliarAsociado(personaId: number, asociadoId: string, parentescoId: number, familiarId: number): void {
    const asignacion = {
      id: familiarId,
      asociado: asociadoId,
      persona: personaId,
      parentesco: parentescoId
    };

    this.familiaresService.updateFamiliar(asignacion).subscribe(
      response => {
        Swal.fire('Éxito', 'Familiar editado correctamente.', 'success');
        this.closeEditModal();
        this.ngOnInit();  
      },
      error => {
        Swal.fire('Error', 'No se pudo editar el familiar del asociado.', 'error');
      }
    );
  }

  openDeactivateModal(familiar: any): void {
    this.selectedFamiliar = { ...familiar };
    this.deactivateModalVisible = true;
  }

  closeDeactivateModal(): void {
    this.deactivateModalVisible = false;
  }

  confirmDeactivate(): void {
    const familiarId = this.selectedFamiliar.idFamiliar;

    this.familiaresService.deactivateFamiliar(familiarId).subscribe(
      response => {
        Swal.fire('Éxito', 'Familiar desactivado correctamente.', 'success');
        this.closeDeactivateModal();
        this.ngOnInit();  
      },
      error => {
        Swal.fire('Error', 'No se pudo desactivar al familiar.', 'error');
      }
    );
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

}
