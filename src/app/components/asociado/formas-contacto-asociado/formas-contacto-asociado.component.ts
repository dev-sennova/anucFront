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

  constructor(
    private formasContactoService: FormasContactoAsociadoService,
    private personasService: PersonasService
  ) {}

  ngOnInit(): void {
    const idAsociado = localStorage.getItem('identificador_asociado') || '';
  
    if (idAsociado) {
      this.personasService.getInfoOneAsociado(idAsociado).subscribe(
        (data) => {
          // Log para verificar la respuesta completa del servicio
          console.log('Respuesta de getInfoOneAsociado:', data);
  
          // Verificar si el dato "asociado" existe
          if (data && data.asociado && data.asociado.length > 0) {
            this.persona = data.asociado[0];  // Asignamos los datos de la persona
            console.log('Datos de la persona:', this.persona);  // Verificar los datos asignados
  
            // Verificar si los permisos están presentes
            if (data.permisos && data.permisos.length > 0) {
              this.permisos = data.permisos[0];  // Asignamos los permisos
              console.log('Datos de los permisos:', this.permisos);  // Verificar los permisos
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

    const permisosData = {
      correo: this.permisos.correo,
      telefono: this.permisos.telefono,
      whatsapp: this.permisos.whatsapp,
      facebook: this.permisos.facebook,
      instagram: this.permisos.instagram,
      habeasData: this.persona.habeasData  
    };
  
    // Imprimir los datos para revisar que se envían correctamente
    console.log('Datos enviados:', permisosData);
  
    this.formasContactoService.updatePermiso(this.permisos.id, permisosData).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Los permisos se actualizaron correctamente',
          confirmButtonText: 'Aceptar'
        });
        this.ngOnInit(); // Recargar los datos después de la actualización
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
