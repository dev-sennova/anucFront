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
    'assets/iconos/fase1-1_icon.png',
    'assets/iconos/fase1-2_icon.png',
    'assets/iconos/fase1-3_icon.png',
    'assets/iconos/fase1-4_icon.png',
    'assets/iconos/fase1-5_icon.png',
    'assets/iconos/fase1-6_icon.png',
    'assets/iconos/fase1-7_icon.png' 
  ];
  
  iconosFase2 = [
    'assets/iconos/fase2-1_icon.png',
    'assets/iconos/fase2-2_icon.png',
    'assets/iconos/fase2-3_icon.png',
    'assets/iconos/fase2-4_icon.png',
    'assets/iconos/fase2-5_icon.png',
    'assets/iconos/fase2-6_icon.png',
    'assets/iconos/fase2-7_icon.png',
    'assets/iconos/fase2-8_icon.png'
  ];
  
  iconosFase3 = [
    'assets/iconos/fase3-1_icon.png',
    'assets/iconos/fase3-2_icon.png',
    'assets/iconos/fase3-3_icon.png',
    'assets/iconos/fase3-4_icon.png',
    'assets/iconos/fase3-5_icon.png',
    'assets/iconos/fase3-6_icon.png',
    'assets/iconos/fase3-7_icon.png'
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
        data.fases_produccion.forEach((fase: any) => console.log('Fase:', fase));
        this.grupos = this.groupFasesByProceso(data.fases_produccion);
      },
      error: (err) => {
        console.error('Error fetching phases', err);
      }
    });
  }

  groupFasesByProceso(fases: any[]): any[] {
    const grupos: any[] = []; 
    fases.forEach((fase, index) => {
      const procesoIndex = grupos.findIndex(grupo => grupo.idGrupo === fase.idGrupo);
      const iconos = this.asignarIconos(fase.idGrupo);
      const icono = iconos[index % iconos.length]; 

      if (procesoIndex === -1) {
        grupos.push({ idGrupo: fase.idGrupo, fases: [{ ...fase, icono }] });
      } else {
        grupos[procesoIndex].fases.push({ ...fase, icono });
      }
    });
    return grupos;
}

asignarIconos(idGrupo: number): string[] {
    switch (idGrupo) {
      case 1:
        return this.iconosFase1;
      case 2:
        return this.iconosFase2;
      case 3:
        return this.iconosFase3;
      default:
        return [];
    }
}


  verDetalleFase(id: number): void {
    this.router.navigate(['/asociado/fases-costos', id]); 
  }
}