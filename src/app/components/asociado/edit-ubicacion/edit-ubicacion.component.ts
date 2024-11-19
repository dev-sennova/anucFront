import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  fincaNueva: any = {}; // Datos para la nueva finca
  mostrarFormularioCrear = false; // Controla si se muestra el formulario de creación
  fincaExiste = false;

  constructor(
    private personasService: PersonasService,
    private veredasService: VeredasService,
    private fincasService: FincasService,
    private route: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    const idUsuario = localStorage.getItem('identificador_asociado') || '';
  
    // Primero, cargar las veredas
    this.veredasService.getVeredas().subscribe(
      (data) => {
        this.veredas = data || [];
  
        // Luego, obtener los datos de producción del asociado
        this.personasService.getInfoOneAsociadoProductos(idUsuario).subscribe(
          (data) => {
            if (data && data.length > 0) {
              this.produccion = data[0];
              if (this.produccion.idFinca) {
                this.cargarFinca();
              } else {
                console.error('idFinca no está definido en los datos de producción');
              }
            }
          },
          (error) => {
            console.error('Error al obtener los datos de producción del asociado', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener las veredas:', error);
      }
    );
  }
  

  cargarFinca(): void {
    if (!this.produccion.idFinca) {
      console.error('idFinca no está definido');
      return;
    }
  
    this.fincasService.getFinca(this.produccion.idFinca).subscribe(
      (data) => {
        this.finca = data[0] || {}; // Asigna un objeto vacío si no hay finca
        this.produccion.vereda = this.finca.vereda || '';
        this.fincaExiste = !!data[0]; 
      },
      (error) => {
        console.error('Error al obtener la finca:', error);
      }
    );
  }
  
  

  trackByVereda(index: number, vereda: any): number {
    return vereda.id;
  }

  crearFinca(): void {
    const nuevaFinca = {
      nombre: this.fincaNueva.nombre,
      extension: this.fincaNueva.extension,
      latitud: this.fincaNueva.latitud,
      longitud: this.fincaNueva.longitud,
      vereda: this.fincaNueva.vereda,
    };

    this.fincasService.storeFinca(nuevaFinca).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Finca creada',
          text: 'La finca se ha creado exitosamente',
          confirmButtonText: 'Aceptar',
        });
        this.ngOnInit();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear la finca. Inténtalo de nuevo.',
          confirmButtonText: 'Aceptar',
        });
        console.error('Error al crear la finca:', error);
      }
    );
  }

  saveFinca(): void {
    const fincaEditada = {
      id: this.produccion.idFinca,
      nombre: this.produccion.nombre,
      extension: this.produccion.extension,
      latitud: this.finca.latitud || '',
      longitud: this.finca.longitud || '',
      vereda: this.produccion.vereda,
    };

    this.fincasService.updateFinca(fincaEditada).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Finca actualizada',
          text: 'La finca se ha actualizado exitosamente',
          confirmButtonText: 'Aceptar',
        });
        this.ngOnInit();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar la finca. Inténtalo de nuevo.',
          confirmButtonText: 'Aceptar',
        });
        console.error('Error al actualizar la finca', error);
      }
    );
  }
}