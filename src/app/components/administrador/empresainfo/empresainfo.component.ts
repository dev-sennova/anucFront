import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmpresaGlobalesService } from 'src/app/services/empresa-globales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresainfo',
  templateUrl: './empresainfo.component.html',
  styleUrls: ['./empresainfo.component.css']
})
export class EmpresainfoComponent implements OnInit {

  empresa: any;
  editEmpresa: any;
  pdfSrc: SafeResourceUrl = '';
  editModalVisible: boolean = false;
  pdfModalVisible: boolean = false; 
  selectedField: string = '';
  editValue: string = '';


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

  openEditModal(field: string) {
    this.selectedField = field;
    this.editValue = this.empresa[field]; 
    this.editModalVisible = true;
  }

  closeEditModal() {
    this.editModalVisible = false;
    this.editValue = '';
  }

  submitEditForm() {
    this.empresa[this.selectedField] = this.editValue;
    this.empresaGlobalesService.updateEmpresa(this.empresa).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Información de la empresa actualizada correctamente.', 'success');
        this.closeEditModal();
      },
      error => {
        Swal.fire('Error', 'No se pudo actualizar la información de la empresa', 'error');
      }
    );
  }

  openPdfModal() {
    this.pdfModalVisible = true;
  }

  closePdfModal() {
    this.pdfModalVisible = false;
  }



}
