import { Component, OnInit } from '@angular/core';
import { CalculodecostosService } from 'src/app/services/calculodecostos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fases-costos',
  templateUrl: './fases-costos.component.html',
  styleUrls: ['./fases-costos.component.css']
})
export class FasesCostosComponent implements OnInit {
  grupos: any[] = []; 
  categoriaId: number; 

  iconosFase1 = [
    'assets/icons/fase1-1_icon.png',
    'assets/icons/fase1-2_icon.png',
    'assets/icons/fase1-3_icon.png',
    'assets/icons/fase1-4_icon.png',
    'assets/icons/fase1-5_icon.png',
    'assets/icons/fase1-6_icon.png',
    'assets/icons/fase1-7_icon.png' 
  ];
  
  iconosFase2 = [
    'assets/icons/fase2-1_icon.png',
    'assets/icons/fase2-2_icon.png',
    'assets/icons/fase2-3_icon.png',
    'assets/icons/fase2-4_icon.png',
    'assets/icons/fase2-5_icon.png',
    'assets/icons/fase2-6_icon.png',
    'assets/icons/fase2-7_icon.png',
    'assets/icons/fase2-8_icon.png'
  ];
  
  iconosFase3 = [
    'assets/icons/fase3-1_icon.png',
    'assets/icons/fase3-2_icon.png',
    'assets/icons/fase3-3_icon.png',
    'assets/icons/fase3-4_icon.png',
    'assets/icons/fase3-5_icon.png',
    'assets/icons/fase3-6_icon.png',
    'assets/icons/fase3-7_icon.png'
  ];

  constructor(
    private calculoCostosService: CalculodecostosService,
    private router: Router
  ) {
    this.categoriaId = parseInt(localStorage.getItem('categoriaId') || '0', 10);
  }

  ngOnInit(): void {
    this.obtenerFasesPorGrupo();
  }

  obtenerFasesPorGrupo(): void {
    this.calculoCostosService.obtenerFasesPorGrupo(this.categoriaId).subscribe({
      next: (data) => {
        console.log('Data fetched:', data);
        this.grupos = this.groupFasesByProceso(data.fases_produccion);
      },
      error: (err) => {
        console.error('Error fetching phases', err);
      }
    });
  }

  groupFasesByProceso(fases: any[]): any[] {
    const grupos: any[] = []; 
    fases.forEach(fase => {
      const procesoIndex = grupos.findIndex(grupo => grupo.proceso === fase.proceso);
      if (procesoIndex === -1) {
        grupos.push({ proceso: fase.proceso, fases: [{ ...fase, iconos: this.asignarIconos(fase.proceso) }] });
      } else {
        grupos[procesoIndex].fases.push({ ...fase, iconos: this.asignarIconos(fase.proceso) });
      }
    });
    return grupos;
  }

  asignarIconos(proceso: string): string[] {
    switch (proceso) {
      case 'Fase 1':
        return this.iconosFase1;
      case 'Fase 2':
        return this.iconosFase2;
      case 'Fase 3':
        return this.iconosFase3;
      default:
        return [];
    }
  }

  verDetalleFase(id: number): void {
    console.log(`Ver detalle de fase con ID: ${id}`);
    this.router.navigate(['/asociado/fases-costos', id]); 
  }
}
