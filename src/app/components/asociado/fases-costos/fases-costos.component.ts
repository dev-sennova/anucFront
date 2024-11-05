import { Component, OnInit } from '@angular/core';
import { CalculodecostosService } from 'src/app/services/calculodecostos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fases-costos',
  templateUrl: './fases-costos.component.html',
  styleUrls: ['./fases-costos.component.css']
})
export class FasesCostosComponent implements OnInit {
  
 

  constructor(
    private calculoCostosService: CalculodecostosService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
   
  }




 
}