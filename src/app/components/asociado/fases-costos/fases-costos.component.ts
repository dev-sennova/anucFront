import { Component, OnInit } from '@angular/core';
import { CalculodecostosService } from 'src/app/services/calculodecostos.service';

@Component({
  selector: 'app-fases-costos',
  templateUrl: './fases-costos.component.html',
  styleUrls: ['./fases-costos.component.css']
})
export class FasesCostosComponent implements OnInit {
//1. Traer el id categoria que se guardo en el localstorage debe de listar las fases que me traiga el id 
// 2.Debo de realizar tres grupos de iconos para los tres diferentes tipos de fases 
  constructor(private calculoDeCostosService: CalculodecostosService) {}
// 3.Cuando me traiga las fases me elimine el id le da la categoria del local storage
  ngOnInit(): void {}
}
