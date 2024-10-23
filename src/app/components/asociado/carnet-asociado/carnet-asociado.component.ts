import { Component, OnInit } from '@angular/core';
import { PersonasService } from 'src/app/services/personas.service';
import { VeredasService } from 'src/app/services/veredas.service';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as docx from 'docx';
import { saveAs } from 'file-saver';



@Component({
  selector: 'app-carnet-asociado',
  templateUrl: './carnet-asociado.component.html',
  styleUrls: ['./carnet-asociado.component.css']
})
export class CarnetAsociadoComponent implements OnInit {

  persona: any;
  veredas: any[] = [];
  produccion: any;
  fotoBase64: string = '';

  constructor(private personasService: PersonasService, private http: HttpClient, private veredasService: VeredasService) { }
  ngOnInit(): void {

    const idAsociado = localStorage.getItem('identificador_asociado') || '';

    this.personasService.getInfoOneAsociado(idAsociado).subscribe(
      (data) => {
        if (data && data.asociado && data.asociado.length > 0) {
          this.persona = data.asociado[0];

          this.fotoBase64 = this.persona.fotoAsociado ? this.persona.fotoAsociado : 'assets/imagenes/logo_anuc_edited.jpg';
        } else {
          console.error('No se encontró el asociado');
        }
      },
      (error) => {
        console.error('Error al obtener persona', error);
      }
    );

    if (idAsociado) {
      this.personasService.getInfoOneAsociado(idAsociado).subscribe(
        (data) => {
          if (data && data.produccion && data.produccion.length > 0) {
            this.produccion = data.produccion.slice(0, 100);
          } else {
            console.error('No se encontraron personas en la respuesta');
          }
        },
        (error) => {
          console.error('Error al obtener persona', error);
        }
      );
    } else {
      console.error('No se encontró id_usuario en el localStorage');
    }

    this.veredasService.getVeredas().subscribe(
      (data) => {
        if (data) {
          this.veredas = data;
        }
      },
      (error) => {
        console.error('Error al obtener las veredas', error);
      }
    );
  }

  getVeredas(id: number): string {
    const vereda = this.veredas.find((s) => s.id === id);
    return vereda ? vereda.vereda : '';
  }

  downloadAsPDF(): void {
    const carnetFrontal = document.getElementById('carnet-frontal');
    const carnetTrasero = document.getElementById('carnet-trasero');

    if (carnetFrontal && carnetTrasero) {
      const doc = new jsPDF();

      html2canvas(carnetFrontal, {}).then((canvas1) => {
        const imgData1 = canvas1.toDataURL('image/png');
        doc.addImage(imgData1, 'PNG', 10, 10, 180, 100);

        html2canvas(carnetTrasero, {}).then((canvas2) => {
          const imgData2 = canvas2.toDataURL('image/png');
          doc.addPage();
          doc.addImage(imgData2, 'PNG', 10, 10, 180, 100);

          doc.save('carnet.pdf');
        });
      });
    }
  }

  downloadAsWord(): void {
  }
}
