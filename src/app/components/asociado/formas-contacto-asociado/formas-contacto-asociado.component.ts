import { Component, OnInit } from '@angular/core';
import { FormasContactoAsociadoService } from 'src/app/services/formas-contacto-asociado-service.service';
import { PersonasService } from 'src/app/services/personas.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formas-contacto-asociado',
  templateUrl: './formas-contacto-asociado.component.html',
  styleUrls: ['./formas-contacto-asociado.component.css']
})
export class FormasContactoAsociadoComponent implements OnInit {

  persona: any = {}; 
  permisos: any = {}; 

  constructor(
    private formasContactoService: FormasContactoAsociadoService,
    private personasService: PersonasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idAsociado = localStorage.getItem('identificador_asociado') || '';
    
    if (idAsociado) {
      this.personasService.getInfoOneAsociado(idAsociado).subscribe(
        (data) => {
          if (data && data.asociado && data.asociado.length > 0) {
            this.persona = data.asociado[0];
            console.log('Datos de la persona:', this.persona);
  
            if (data.permisos && data.permisos.length > 0) {
              this.permisos = data.permisos[0];  // Cargar permisos correctamente
              console.log('Datos de los permisos:', this.permisos);
            } else {
              console.error('No se encontraron permisos para el asociado.');
            }
          } else {
            console.error('No se encontró el asociado.');
          }
        },
        (error) => {
          console.error('Error al obtener los datos del asociado:', error);
        }
      );
    } else {
      console.error('El idAsociado no está disponible en el localStorage');
    }
  }
  
  onSubmit(): void {
    const contactosVisibles = [
      { tipo: 'correo', permiso: Number(this.permisos.correo), valor: this.persona.correo },
      { tipo: 'telefono', permiso: Number(this.permisos.telefono), valor: this.persona.telefono },
      { tipo: 'whatsapp', permiso: Number(this.permisos.whatsapp), valor: this.persona.whatsapp },
      { tipo: 'facebook', permiso: Number(this.permisos.facebook), valor: this.persona.facebook },
      { tipo: 'instagram', permiso: Number(this.permisos.instagram), valor: this.persona.instagram }
    ];
  
    const contactosNoVacios = contactosVisibles.filter(contacto => contacto.valor);
  
    // Verifica si al menos un contacto es público (permiso === 1)
    const contactoPublico = contactosNoVacios.some(contacto => contacto.permiso === 1);
  
    if (!contactoPublico) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta contacto público',
        text: 'Debes seleccionar al menos una forma de contacto pública para continuar.',
        confirmButtonText: 'Aceptar'
      });
      return; 
    }
  
    // Continuar con la actualización de permisos
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
        this.ngOnInit(); // Recargar la información actualizada
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
  
  
  aceptarOrechazar() {
    const idAsociado = localStorage.getItem('identificador_asociado') || '';
    const idPersona = localStorage.getItem('identificador_persona') || '';
    const fotoAsociado = this.persona.fotoAsociado;
    const categoria = this.permisos.categoria;
    const habeasData = this.permisos.habeasData;

    if (idAsociado && idPersona) {
      this.formasContactoService.updatePermisoHabeasData(idAsociado, idPersona, habeasData, categoria, fotoAsociado).subscribe(
        (response) => {
          if (habeasData === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Habeas Data Rechazado',
              text: 'Al rechazar los términos y condiciones, la sesión se cerrará.',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              localStorage.clear();
              this.router.navigate(['/login']);
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: '¡Habeas Data Aceptado!',
              text: 'Gracias por aceptar los términos y condiciones.',
              confirmButtonText: 'Aceptar'
            });
          }
        },
        (error) => {
          console.error('Error al actualizar el habeas data', error);
        }
      );
    } else {
      console.error('No se encontraron los IDs de asociado o persona en el localStorage');
    }
  }
  
}
