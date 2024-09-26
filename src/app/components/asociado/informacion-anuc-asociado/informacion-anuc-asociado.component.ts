import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmpresaGlobalesService } from 'src/app/services/empresa-globales.service';


@Component({
  selector: 'app-informacion-anuc-asociado',
  templateUrl: './informacion-anuc-asociado.component.html',
  styleUrls: ['./informacion-anuc-asociado.component.css']
})
export class InformacionAnucAsociadoComponent implements OnInit{

  empresa: any;
  horariosArray: string[] = [];
  horariosDescargueArray: string[] = [];
  currentYear: number = new Date().getFullYear();
  isModalOpen: boolean = false;
  pdfSrc: SafeResourceUrl | undefined; 

  constructor(
    private empresaPublicaService: EmpresaGlobalesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getEmpresaPublica();
  }

  getEmpresaPublica(): void {
    this.empresaPublicaService.getEmpresaGlobales().subscribe(
      data => {
        this.empresa = data;
        this.horariosArray = this.empresa.horarios.split(/\r?\n/);
        this.horariosDescargueArray = this.empresa.horariosCargue.split(/\r?\n/);
        // Asegurar la URL del PDF de manera segura en el código TypeScript
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${this.empresa.estatutos}`);
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  abrirModal(): void {
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }

  descargarEstatutos(): void {
    const linkSource = `data:application/pdf;base64,${this.empresa.estatutos}`;
    const downloadLink = document.createElement("a");
    const fileName = `Estatutos_ANUC_${this.currentYear}.pdf`;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

}
