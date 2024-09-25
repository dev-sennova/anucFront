import { LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SessionInterceptor } from './interceptors/session.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { OfertaComponent } from './components/oferta/oferta.component';
import { AsociadoComponent } from './components/asociado/asociado.component';
import { AdministradorComponent } from './components/administrador/administrador.component';
import { GestionarproductosComponent } from './components/asociado/gestionarproductos/gestionarproductos.component';
import { PublicarofertaComponent } from './components/asociado/publicaroferta/publicaroferta.component';
import { AdministrarasociadosComponent } from './components/administrador/administrarasociados/administrarasociados.component';
import { CreatepasswordComponent } from './components/createpassword/createpassword.component';
import { ListadogeneralComponent } from './components/administrador/listadogeneral/listadogeneral.component';
import { EmpresainfoComponent } from './components/administrador/empresainfo/empresainfo.component';
import { InformaciondesplegableComponent } from './components/administrador/informaciondesplegable/informaciondesplegable.component';
import { VeredasComponent } from './components/administrador/veredas/veredas.component';
import { ProductoscategoriasComponent } from './components/administrador/productoscategorias/productoscategorias.component';
import { InicioComponent } from './components/administrador/inicio/inicio.component';
import { CategoriasproductosComponent } from './components/administrador/categoriasproductos/categoriasproductos.component';
import { ParentescosComponent } from './components/administrador/parentescos/parentescos.component';
import { EditDatosComponent } from './components/asociado/edit-datos/edit-datos.component';
import { EditProductosComponent } from './components/asociado/edit-productos/edit-productos.component';
import { EditUbicacionComponent } from './components/asociado/edit-ubicacion/edit-ubicacion.component';
import { InicioAsociadoComponent } from './components/asociado/inicio-asociado/inicio-asociado.component';
import { EditPasswordAsociadoComponent } from './components/asociado/edit-password-asociado/edit-password-asociado.component';
import { GestionarNucleoFamiliarComponent } from './components/asociado/gestionar-nucleo-familiar/gestionar-nucleo-familiar.component';
import { CarnetAsociadoComponent } from './components/asociado/carnet-asociado/carnet-asociado.component';
import { OfertaAsociadoComponent } from './components/asociado/oferta-asociado/oferta-asociado.component';
import { NovedadesAsociadoComponent } from './components/asociado/novedades-asociado/novedades-asociado.component';
import { AdministrarofertasComponent } from './components/administrador/administrarofertas/administrarofertas.component';
import { LoadingComponent } from './components/loading/loading.component';
import { InformacionAnucAsociadoComponent } from './components/asociado/informacion-anuc-asociado/informacion-anuc-asociado.component';
import { BuscarAsociadosComponent } from './components/asociado/buscar-asociados/buscar-asociados.component';



const materialModules = [
  MatCardModule,
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatListModule,
  MatIconModule,
  MatTableModule,
  MatSidenavModule,
  MatDividerModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatListModule,
  MatPaginatorModule,
  MatButtonToggleModule,
  MatRadioModule
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NosotrosComponent,
    MenuComponent,
    FooterComponent,
    ProveedoresComponent,
    OfertaComponent,
    AsociadoComponent,
    AdministradorComponent,
    GestionarproductosComponent,
    PublicarofertaComponent,
    AdministrarasociadosComponent,
    CreatepasswordComponent,
    ListadogeneralComponent,
    EmpresainfoComponent,
    InformaciondesplegableComponent,
    VeredasComponent,
    ProductoscategoriasComponent,
    InicioComponent,
    CategoriasproductosComponent,
    ParentescosComponent,
    EditDatosComponent,
    EditProductosComponent,
    EditUbicacionComponent,
    InicioAsociadoComponent,
    EditPasswordAsociadoComponent,
    GestionarNucleoFamiliarComponent,
    CarnetAsociadoComponent,
    OfertaAsociadoComponent,
    NovedadesAsociadoComponent,
    AdministrarofertasComponent,
    LoadingComponent,
    InformacionAnucAsociadoComponent,
    BuscarAsociadosComponent,
    
  ],
  imports: [
    BrowserModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    CommonModule,
    ...materialModules,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    DragDropModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SessionInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es' },
    
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class AppModule {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

 }
