import { Component, OnInit } from '@angular/core';
import { FormasContactoAsociadoService } from 'src/app/services/formas-contacto-asociado-service.service';
import { PersonasService } from 'src/app/services/personas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formas-contacto-asociado',
  templateUrl: './formas-contacto-asociado.component.html',
  styleUrls: ['./formas-contacto-asociado.component.css']
})
export class FormasContactoAsociadoComponent implements OnInit {

  persona: any = {}; 
  permisos: any = {}; 

  constructor(private formasContactoService: FormasContactoAsociadoService,
    private personasService: PersonasService
  ) {}

  ngOnInit(): void {

    const idUsuario = localStorage.getItem('identificador_usuario') || '';
    const idAsociado = localStorage.getItem('identificador_asociado') || '';
    const idAsociadoFinca = localStorage.getItem('identificador_asociado_finca') || '';
    const idPersona = localStorage.getItem('identificador_persona') || '';

    this.personasService.getInfoOneAsociado(idAsociado).subscribe(
      (data) => {
        if (data && data.permisos && data.permisos.length > 0) {
          this.permisos = data.permisos[0]; 
        } else {
          console.error('No se encontró el asociado');
        }
      },
      (error) => {
        console.error('Error al obtener persona', error);
      }
    );

    this.personasService.getInfoOneAsociado(idAsociado).subscribe(
      (data) => {
        if (data && data.asociado && data.asociado.length > 0) {
          this.persona = data.asociado[0]; 
        } else {
          console.error('No se encontró el asociado');
        }
      },
      (error) => {
        console.error('Error al obtener persona', error);
      }
    );
  }

  onSubmit(): void {

    const permisosData = {
      correo: this.permisos.correo,
      telefono: this.permisos.telefono,
      whatsapp: this.permisos.whatsapp,
      facebook: this.permisos.facebook,
      instagram: this.permisos.instagram,
    };
  
    this.formasContactoService.updatePermiso(this.permisos.id, permisosData).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Los permisos se actualizaron correctamente',
          confirmButtonText: 'Aceptar'
        });
        this.ngOnInit();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al actualizar los permisos',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

}
