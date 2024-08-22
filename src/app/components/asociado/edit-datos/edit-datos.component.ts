import { Component, OnInit } from '@angular/core';
import { EstadoCivilService } from 'src/app/services/estado-civil.service';
import { SexoService } from 'src/app/services/sexo.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';

@Component({
  selector: 'app-edit-datos',
  templateUrl: './edit-datos.component.html',
  styleUrls: ['./edit-datos.component.css'],
})
export class EditDatosComponent implements OnInit {
  estadosCiviles: any[] = [];
  tipoDocumentos: any[] = [];
  sexos: any[] = [];

  constructor(
    private estadoCivilService: EstadoCivilService,
    private tipoDeDocumentoService: TipoDocumentoService,
    private sexoService: SexoService
  ) {}
  ngOnInit(): void {
    this.estadoCivilService.getEstadosCiviles().subscribe(
      (data) => {
        if (data) {
          this.estadosCiviles = data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );

    this.tipoDeDocumentoService.getTiposDocumento().subscribe(
      (data) => {
        if (data) {
          this.tipoDocumentos = data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );
    this.sexoService.getSexos().subscribe(
      (data) => {
        if (data) {
          this.sexos= data;
        }
      },
      (error) => {
        console.error('Error al obtener los estados civiles:', error);
      }
    );


  }


}
