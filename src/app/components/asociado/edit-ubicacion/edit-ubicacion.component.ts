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
    this.cargarVeredasYProduccion(idUsuario);
    this.cargarTiposPredio(); // Llamar a cargarTiposPredio sin pasar el id
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
              console.log('Producción cargada:', this.produccion);

              if (this.produccion.idFinca) {
                this.cargarFinca(); // Verificar si ya existe una finca
              } else {
                console.warn('No se encontró idFinca en los datos de producción');
                this.fincaExiste = false; // No hay finca
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
        console.log('Datos de finca obtenidos:', data);
        this.finca = data || {}; // Corrige aquí, usa data en lugar de data[0]
        this.fincaExiste = !!data;
        console.log('Estado de fincaExiste:', this.fincaExiste);
        this.cdr.detectChanges(); // Asegúrate de que Angular detecte los cambios en la vista
      },
      (error) => {
        console.error('Error al obtener la finca:', error);
        this.fincaExiste = false; // Asumimos que no existe finca si hay error
        this.cdr.detectChanges(); // Asegúrate de que Angular detecte los cambios en la vista
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
        console.log('Respuesta completa de la API:', response);
  
        if (response && response.estado === 'Ok' && response.id) {
          Swal.fire({
            icon: 'success',
            title: 'Finca creada',
            text: response.message || 'La finca se ha creado exitosamente',
            confirmButtonText: 'Aceptar',
          });
  
          const idFincaCreada = response.id; // Asegúrate de que este es el ID correcto retornado por la API
          console.log('ID de la finca creada:', idFincaCreada); // Verifica el ID
  
          if (!idFincaCreada) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener el ID de la finca recién creada.',
              confirmButtonText: 'Aceptar',
            });
            return;
          }
  
          // Almacenar el id en localStorage
          localStorage.setItem('id_finca', idFincaCreada);
  
          const idAsociado = localStorage.getItem('identificador_asociado') || '';
          const tipoPredio = 'tipo_predio_placeholder'; // Reemplaza esto con el valor adecuado
  
          // Asociar la finca creada con el asociado
          this.fincasService.asociarFincaConAsociado(idFincaCreada, idAsociado, tipoPredio).subscribe(
            (asociarResponse) => {
              console.log('Finca asociada con el asociado:', asociarResponse);
  
              // Refrescar datos
              this.ngOnInit();
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
