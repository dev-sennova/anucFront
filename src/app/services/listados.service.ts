import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalConstants } from '../commons/global-constants';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ListadosService {

  constructor() { }
}
