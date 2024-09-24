import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  showLoading() {
    this.loadingSubject.next(true);
  }

  hideLoading() {
    setTimeout(() => {
      this.loadingSubject.next(false);
    }, 2000); 
  }
  
}
