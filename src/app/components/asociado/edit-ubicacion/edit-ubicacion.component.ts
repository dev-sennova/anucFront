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

  constructor(
    private personasService: PersonasService,
    private veredasService: VeredasService,
    private fincasService: FincasService,
    private route: Router,
    private cdr: ChangeDetectorRef
  ) {}

ngOnInit(): void {
  const idUsuario = localStorage.getItem('identificador_asociado') || '';

  if (idUsuario) {
    this.personasService.getInfoOneAsociadoProductos(idUsuario).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.produccion = data[0];
          console.log('Datos de producción obtenidos:', this.produccion); // Depuración

          this.veredasService.getVeredas().subscribe(
            (data) => {
              this.veredas = data || [];
              console.log('Veredas cargadas:', this.veredas); // Depuración
              this.fincasService.getFincaByAsociado(idUsuario).subscribe(
                (fincaData) => {
                  if (fincaData && fincaData.id) {
                    this.finca = fincaData;
                    this.produccion.idFinca = fincaData.id;
                    this.fincaExiste = true;
                    console.log('Finca cargada:', this.finca); // Depuración
                    this.cdr.detectChanges();
                  } else {
                    this.fincaExiste = false;
                  }
                },
                (error) => {
                  console.error('Error al obtener la finca del asociado:', error);
                  this.fincaExiste = false;
                }
              );
            },
            (error) => {
              console.error('Error al obtener las veredas:', error);
            }
          );
        } else {
          this.fincaExiste = false;
        }
      },
      (error) => {
        console.error('Error al obtener los datos de producción del asociado', error);
        this.fincaExiste = false;
      }
    );
  } else {
    this.fincaExiste = false;
  }

  this.cargarVeredasYProduccion(idUsuario);
  this.cargarTiposPredio();
}

  
  
  cargarFinca(): void {
    const idFinca = this.produccion.idFinca || localStorage.getItem('id_finca');
    if (!idFinca) {
      console.error('idFinca no está definido');
      return;
    }
  
    this.fincasService.getFinca(idFinca).subscribe(
      (data) => {
        console.log('Datos de finca obtenidos:', data);
        if (data && data.id) {
          this.finca = data;
          this.produccion = { ...this.produccion, ...data }; // Asignar los datos de finca a producción
          this.fincaExiste = true;
          console.log('Producción actualizada:', this.produccion); // Depuración
          console.log('Finca existe:', this.fincaExiste); // Depuración
        } else {
          console.error('Datos de finca no válidos:', data);
        }
        this.cdr.detectChanges(); // Asegúrate de que Angular detecte los cambios en la vista
      },
      (error) => {
        console.error('Error al obtener la finca:', error);
        this.fincaExiste = false;
        this.cdr.detectChanges();
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
    
  trackByTipoPredio(index: number, tipo: any): number {
    return tipo.id;
  }

  cargarVeredasYProduccion(idUsuario: string): void {
    this.veredasService.getVeredas().subscribe(
      (data) => {
        this.veredas = data || [];
        console.log('Veredas cargadas:', this.veredas);
  
        this.personasService.getInfoOneAsociadoProductos(idUsuario).subscribe(
          (data) => {
            if (data && data.length > 0) {
              this.produccion = data[0];
              if (this.produccion.idFinca) {
                this.cargarFinca();
              } else {
                this.fincaExiste = false;
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
      tipo_predio: this.fincaNueva.tipo_predio
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
          console.log('ID de finca creada:', idFincaCreada); // Registro de depuración
  
          // Obtener la finca completa con el ID recién creado
          this.fincasService.getFinca(idFincaCreada).subscribe(
            (fincaCreada) => {
              if (fincaCreada) {
                console.log('Finca creada obtenida:', fincaCreada); // Registro de depuración
                this.finca = fincaCreada;
  
                const idAsociado = localStorage.getItem('identificador_asociado') || '';
                const tipoPredio = this.fincaNueva.tipo_predio;
  
                this.produccion = { ...this.produccion, idFinca: fincaCreada.id }; // Asegurar que produccion esté definido
                this.fincaExiste = true;
  
                // Asociar la finca creada con el asociado
                this.fincasService.asociarFincaConAsociado(fincaCreada.id, idAsociado, tipoPredio).subscribe(
                  (asociarResponse) => {
                    console.log('Finca asociada con el asociado:', asociarResponse);
                    this.cargarFinca(); // Actualizar la lista de fincas
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
      id: this.produccion.idFinca,
      nombre: this.produccion.nombre,
      extension: this.produccion.extension,
      latitud: this.finca.latitud || '',
      longitud: this.finca.longitud || '',
      vereda: this.produccion.vereda,
    };
  
    console.log('Datos enviados para actualizar la finca:', fincaEditada);
  
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
