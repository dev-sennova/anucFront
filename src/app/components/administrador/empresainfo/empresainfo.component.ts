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
  editEstatutosModalVisible: boolean = false;
  selectedField: string = '';
  editValue: string = '';
  selectedFile: File | null = null;


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

  openEditEstatutosModal() {
    this.editEstatutosModalVisible = true;
  }

  closeEditEstatutosModal() {
    this.editEstatutosModalVisible = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      Swal.fire('Error', 'El archivo seleccionado debe ser un PDF', 'error');
    }
  }

  submitEstatutosForm() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64PDF = (reader.result as string).split(',')[1];
        this.empresa.estatutos = base64PDF;
        this.empresaGlobalesService.updateEmpresa(this.empresa).subscribe(
          response => {
            Swal.fire('¡Éxito!', 'Estatutos actualizados correctamente.', 'success');
            this.updatePdfSrc(base64PDF); 
            this.closeEditEstatutosModal();
          },
          error => {
            Swal.fire('Error', 'No se pudo actualizar los estatutos', 'error');
          }
        );
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      Swal.fire('Error', 'Debes seleccionar un archivo PDF', 'error');
    }
  }

  updatePdfSrc(base64PDF: string) {
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${base64PDF}`);
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
