import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonasService } from 'src/app/services/personas.service';

@Component({
  selector: 'app-edit-productos',
  templateUrl: './edit-productos.component.html',
  styleUrls: ['./edit-productos.component.css']
})
export class EditProductosComponent implements OnInit {

  asociado: any = {};
  produccionUnica: any[] = [];

  constructor(
    private route: Router,
    private produccionService: PersonasService
  ) {}

  ngOnInit(): void {
    const asociadosFincaId = localStorage.getItem('identificador_usuario') || '';
    
    this.produccionService.getInfoOneAsociado(asociadosFincaId).subscribe(
      response => {
        if (response.estado === 'Ok') {
          this.asociado = response.asociado[0];
          this.eliminarDuplicados(response.produccion);
        }
      },
      error => {
        console.error('Error fetching data', error);
      }
    );
  }

  eliminarDuplicados(produccion: any[]): void {
    const seen = new Set();
    this.produccionUnica = produccion.filter(prod => {
      const duplicate = seen.has(prod.producto);
      seen.add(prod.producto);
      // Verificar y formatear la imagen base64
      if (prod.imagenProducto && !prod.imagenProducto.startsWith('data:')) {
        prod.imagenProducto = `data:image/jpeg;base64,${prod.imagenProducto}`;
      }
      return !duplicate;
    });
  }
}
