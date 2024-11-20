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
    const fincaExiste = localStorage.getItem('finca_existe') === 'true';
    this.fincaExiste = fincaExiste;
  
    if (fincaExiste) {
      const idFinca = localStorage.getItem('id_finca');
      if (idFinca) {
        this.produccion.idFinca = idFinca;
        this.cargarFinca(); // Cargar datos de la finca existente
      }
    }
    this.cargarVeredasYProduccion(idUsuario);
    this.cargarTiposPredio();
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
  

  cargarFinca(): void {
    const idFinca = this.produccion.idFinca || localStorage.getItem('id_finca'); // Obtener idFinca desde producción o localStorage
    if (!idFinca) {
      console.error('idFinca no está definido');
      return;
    }
    
    this.fincasService.getFinca(idFinca).subscribe(
      (data) => {
        console.log('Datos de finca obtenidos:', data);
        if (Array.isArray(data) && data.length > 0) {
          this.finca = data[0] || {}; // Asigna el primer objeto si es un array
          this.produccion = { ...this.produccion, ...data[0] }; // Asigna los datos de finca a produccion
          this.fincaExiste = !!data[0];
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
          localStorage.setItem('id_finca', idFincaCreada);
          localStorage.setItem('finca_existe', 'true'); // Guardar el estado de fincaExiste
  
          const idAsociado = localStorage.getItem('identificador_asociado') || '';
          const tipoPredio = this.fincaNueva.tipo_predio;
  
          this.fincasService.asociarFincaConAsociado(idFincaCreada, idAsociado, tipoPredio).subscribe(
            (asociarResponse) => {
              console.log('Finca asociada con el asociado:', asociarResponse);
  
              // Redirigir al formulario de edición
              this.fincaExiste = true;
              this.cargarFinca();
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
