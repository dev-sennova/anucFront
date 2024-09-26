import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit{

  isLoading!: Observable<boolean>;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.isLoading = this.loadingService.loading$;
    this.isLoading.subscribe(isLoading => {
      console.log('Cargando:', isLoading);
    });
  }
  
}
