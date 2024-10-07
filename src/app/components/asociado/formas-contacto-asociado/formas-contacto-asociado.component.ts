import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormasContactoAsociadoService } from 'src/app/services/formas-contacto-asociado-service.service';

@Component({
  selector: 'app-formas-contacto-asociado',
  templateUrl: './formas-contacto-asociado.component.html',
  styleUrls: ['./formas-contacto-asociado.component.css']
})
export class FormasContactoAsociadoComponent implements OnInit {
  formasContacto: any = {
    correo: '',
    telefono: '',
    whatsapp: '',
    facebook: '',
    instagram: '',
    permisos: {
      correo: 'publico',
      telefono: 'publico',
      whatsapp: 'publico',
      facebook: 'publico',
      instagram: 'publico'
    }
  };
  
  habeasDataAceptado: boolean = true;

  constructor(private formasContactoService: FormasContactoAsociadoService) {}

  ngOnInit(): void {
    this.getFormasContacto();
  }

  getFormasContacto(): void {
    this.formasContactoService.getPermisos().subscribe((data) => {
      this.formasContacto = data;
      this.habeasDataAceptado = data.habeas_data;
    });
  }

  onSubmit(): void {
    this.formasContactoService.updatePermiso(this.formasContacto.id, this.formasContacto).subscribe((response) => {
      console.log('Permisos actualizados:', response);
    });

    this.formasContactoService.updatePermisoHabeasData(this.habeasDataAceptado).subscribe((response) => {
      console.log('Habeas Data actualizado:', response);
    });
  }
}
