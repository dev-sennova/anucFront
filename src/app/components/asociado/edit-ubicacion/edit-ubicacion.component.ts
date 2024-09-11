import { Component, OnInit } from '@angular/core';
import { PersonasService } from 'src/app/services/personas.service';
import { SexoService } from 'src/app/services/sexo.service';
import { TiposPredioService } from 'src/app/services/tipos-predio.service';
import { VeredasComponent } from '../../administrador/veredas/veredas.component';
import { VeredasService } from 'src/app/services/veredas.service';
import { FincasService } from 'src/app/services/fincas.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Component({
  selector: 'app-edit-ubicacion',
  templateUrl: './edit-ubicacion.component.html',
  styleUrls: ['./edit-ubicacion.component.css']
})
export class EditUbicacionComponent implements OnInit{

  produccion: any = {};  
  finca: any = {}; 
  veredas: any[] = [];

  constructor(
    private personasService: PersonasService,
    private veredasService: VeredasService,
    private fincasService: FincasService,
    private route: Router
  ) {}

  ngOnInit(): void {
    const idUsuario = localStorage.getItem('identificador_usuario') || '';

    this.personasService.getInfoOneAsociadoProductos(idUsuario).subscribe(
      (data) => {
        if (data) {
          this.produccion = data[0];
          this.fincasService.getFinca(this.produccion.idFinca).subscribe(
            (data) => {
              this.finca = data[0];
              
            },
            (error) => {
              console.error('Error al obtener la finca:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener los datos de producción del asociado', error);
      }
    );

    this.veredasService.getVeredas().subscribe(
      (data) => { this.veredas = data || []; },
      (error) => { console.error('Error al obtener las veredas:', error); }
    );
  }
  
  getVeredas(id: number): string {
    const vereda = this.veredas.find((s) => s.id === id);
    return vereda ? vereda.vereda : '';
  }

  saveFinca() {
    const fincaEditada = {
      id: this.produccion.idFinca,
      nombre: this.produccion.nombre,
      extension: this.produccion.extension,
      latitud: this.finca.latitud || '',
      longitud: this.finca.longitud || '',
      vereda: this.produccion.vereda
    };

    this.fincasService.updateFinca(fincaEditada).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Finca actualizada',
          text: 'La finca se ha actualizado exitosamente',
          confirmButtonText: 'Aceptar'
        });
        this.ngOnInit();
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar la finca. Inténtalo de nuevo.',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error al actualizar la finca', error);
      }
    );
  }


}
