import { Component, OnInit } from '@angular/core';
import { EmpresaGlobalesService } from 'src/app/services/empresa-globales.service';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent implements OnInit {

  empresa: any;
  horariosArray: string[] = [];
  

  constructor(private empresaPublicaService: EmpresaGlobalesService) { }

  ngOnInit(): void {
    this.getEmpresaPublica();
  }

  getEmpresaPublica(): void {
    this.empresaPublicaService.getEmpresaPublico().subscribe(
      data => {
        this.empresa = data;  // Adjusted to access the first company
        this.horariosArray = this.empresa.horarios.split(/\r?\n/);
        console.log(this.horariosArray);  // Split the horarios string into an array
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }


}
