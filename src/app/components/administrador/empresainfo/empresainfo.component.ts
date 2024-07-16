import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmpresaGlobalesService } from 'src/app/services/empresa-globales.service';

@Component({
  selector: 'app-empresainfo',
  templateUrl: './empresainfo.component.html',
  styleUrls: ['./empresainfo.component.css']
})
export class EmpresainfoComponent implements OnInit {

  empresa: any;
  pdfSrc: SafeResourceUrl = '';

  constructor(private empresaGlobalesService: EmpresaGlobalesService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.empresaGlobalesService.getEmpresaGlobales().subscribe(
      data => {
        this.empresa = data;
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${this.empresa.estatutos}`);
      },
      error => {
        console.error('Error al obtener los datos de la empresa', error);
      }
    );
  }


}
