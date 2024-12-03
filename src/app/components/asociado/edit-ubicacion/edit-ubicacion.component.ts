import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PersonasService } from 'src/app/services/personas.service';
import { VeredasService } from 'src/app/services/veredas.service';
import { FincasService } from 'src/app/services/fincas.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-ubicacion',
  templateUrl: './edit-ubicacion.component.html',
  styleUrls: ['./edit-ubicacion.component.css']
})
export class EditUbicacionComponent implements OnInit {
  produccion: any = {};
  finca: any = {};
  veredas: any[] = [];
  fincaNueva: any = {}; // Datos para la nueva finca
  fincaExiste = false;
  tiposPredio: any[] = [];
  nombre: any;
  extension: any;
  latitud: any;
  longitud: any;
  vereda: any;
  tipo_predio: any;
  idAsociacion: any;
  idFinca: any;
  idAsociado: any;
  idTipoPredio: any;

  constructor(
    private veredasService: VeredasService,
    private fincasService: FincasService
  ) {}

  ngOnInit(): void {
      const idAsociado = localStorage.getItem('identificador_asociado') || '';

      this.cargarFinca(idAsociado);
      this.cargarVeredas();
      this.cargarTiposPredio();
  }


  cargarFinca(idAsociado:string): void {
    this.fincasService.getFincaResumenByAsociado(idAsociado).subscribe(
      (data) => {

        this.finca = data.asociados_finca;
        this.produccion = this.finca[0];
        console.log('Finca cargada:', this.finca);
        console.log('Produccion cargada:', this.produccion);
        console.log('Finca id cargada:', this.produccion.idFinca);

        if (this.produccion.idFinca > 0) {
          this.idFinca= this.produccion.idFinca;
          this.nombre= this.produccion.nombreFinca;
          this.extension= this.produccion.extension;
          this.latitud= this.produccion.latitud;
          this.longitud= this.produccion.longitud;
          this.vereda= this.produccion.idVereda;
          this.idAsociacion= this.produccion.idAsociacion;
          this.idAsociado= this.produccion.idAsociado;
          this.tipo_predio= this.produccion.idTipoPredio;
          this.fincaExiste = true;
          localStorage.setItem('identificador_asociado_finca', this.idAsociacion);
        } else {
          this.nombre= "";
          this.extension= 0;
          this.latitud= "";
          this.longitud= "";
          this.vereda= 0;
          this.tipo_predio= 0;
          this.fincaExiste = false;
        }
      },
      (error) => {
        console.error('Error al obtener la finca del asociado:', error);
        this.fincaExiste = false;
      }
    );
  }

  // Nueva función para cargar Veredas
  cargarVeredas(): void {
    this.veredasService.getVeredas().subscribe(
      (data) => {
        this.veredas = data || [];
        console.log('Veredas cargadas:', this.veredas);
      },
      (error) => {
        console.error('Error al obtener las veredas:', error);
      }
    );
  }

  cargarTiposPredio(): void {
    this.fincasService.getTiposPredio().subscribe(
      (data) => {
        this.tiposPredio = data || [];
        console.log('Tipos de predio cargados:', this.tiposPredio);
      },
      (error) => {
        console.error('Error al obtener los tipos de predio:', error);
      }
    );
  }

  crearFinca(): void {
    const nuevaFinca = {
      nombre: this.nombre,
      extension: this.extension,
      latitud: this.latitud,
      longitud: this.longitud,
      vereda: this.vereda,
      tipo_predio: this.tipo_predio
    };

    this.fincasService.storeFinca(nuevaFinca).subscribe(
      (response) => {
        if (response && response.estado === 'Ok' && response.id) {
          Swal.fire({
            icon: 'success',
            title: 'Finca creada',
            text: response.message || 'La finca se ha creado exitosamente',
            confirmButtonText: 'Aceptar',
          });

          const idFincaCreada = response.id;
          console.log('ID de finca creada:', idFincaCreada);

          // Obtener la finca completa con el ID recién creado y guardarla en localStorage
          this.fincasService.getFinca(idFincaCreada).subscribe(
            (fincaCreada) => {
              if (fincaCreada) {
                this.finca = fincaCreada;

                const idAsociado = localStorage.getItem('identificador_asociado') || '';
                const tipoPredio = this.tipo_predio;

                this.fincaExiste = true;

                // Asociar la finca creada con el asociado
                this.fincasService.asociarFincaConAsociado(fincaCreada.id, idAsociado, tipoPredio).subscribe(
                  (asociarResponse) => {
                    console.log('Finca asociada con el asociado:', asociarResponse);
                    this.cargarFinca(idAsociado); // Actualizar la lista de fincas
                  },
                  (error) => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'Hubo un problema al asociar la finca con el asociado. Inténtalo de nuevo.',
                      confirmButtonText: 'Aceptar',
                    });
                    console.error('Error al asociar la finca con el asociado:', error);
                  }
                );
              } else {
                console.error('Error: No se pudieron obtener los datos de la finca recién creada');
              }
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al obtener la finca recién creada. Inténtalo de nuevo.',
                confirmButtonText: 'Aceptar',
              });
              console.error('Error al obtener la finca recién creada:', error);
            }
          );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el ID de la finca recién creada.',
            confirmButtonText: 'Aceptar',
          });
        }
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
      id: this.idFinca,
      nombre: this.nombre,
      extension: this.extension,
      latitud: this.latitud,
      longitud: this.longitud,
      vereda: this.vereda
    };

    const asociacionEditada = {
      id:this.idAsociacion,
      finca: this.idFinca,
      asociado: this.idAsociado,
      tipo_predio: this.tipo_predio
    };

    console.log('Datos enviados para actualizar la finca:', fincaEditada);

    this.fincasService.updateFinca(fincaEditada).subscribe(
      (response) => {
        this.fincasService.updateAsociacion(asociacionEditada).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Finca actualizada',
              text: 'La finca se ha actualizado exitosamente',
              confirmButtonText: 'Aceptar',
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al actualizar la asociación finca. Inténtalo de nuevo.',
              confirmButtonText: 'Aceptar',
            });
            console.error('Error al actualizar la finca', error);
          }
        );
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
