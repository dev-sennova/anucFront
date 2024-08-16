import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
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
import { ParentescosComponent } from './components/administrador/parentescos/parentescos.component';
import { CategoriasproductosComponent } from './components/administrador/categoriasproductos/categoriasproductos.component';
import { InicioAsociadoComponent } from './components/asociado/inicio-asociado/inicio-asociado.component';
import { EditDatosComponent } from './components/asociado/edit-datos/edit-datos.component';
import { EditProductosComponent } from './components/asociado/edit-productos/edit-productos.component';
import { EditUbicacionComponent } from './components/asociado/edit-ubicacion/edit-ubicacion.component';
import { EditPasswordAsociadoComponent } from './components/asociado/edit-password-asociado/edit-password-asociado.component';
import { CarnetAsociadoComponent } from './components/asociado/carnet-asociado/carnet-asociado.component';
import { OfertaAsociadoComponent } from './components/asociado/oferta-asociado/oferta-asociado.component';
import { NovedadesAsociadoComponent } from './components/asociado/novedades-asociado/novedades-asociado.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'crearcontrasena', component: CreatepasswordComponent},
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'oferta', component: OfertaComponent },
  { path: 'asociado', component: AsociadoComponent, 
    children: [
      { path: 'gestionproductos', component: GestionarproductosComponent },
      { path: 'publicaroferta', component: PublicarofertaComponent },
      { path: 'inicio-asociado', component: InicioAsociadoComponent },
      { path: 'edit-datos-asociado', component: EditDatosComponent },
      { path: 'edit-productos-asociado', component: EditProductosComponent},
      { path: 'edit-ubicacion-asociado', component: EditUbicacionComponent},
      { path: 'edit-password-asociado', component:EditPasswordAsociadoComponent},
      { path: 'gestionar-nucleo-familiar', component:GestionarproductosComponent},
      { path: 'carnet-asociado', component:CarnetAsociadoComponent},
      { path: 'oferta-asociado', component:OfertaAsociadoComponent},
      { path: 'novedades-asociado', component:NovedadesAsociadoComponent},
    ]
  },
  { path: 'administrador', component: AdministradorComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component:InicioComponent},
      { path: 'personas', component: AdministrarasociadosComponent},
      { path: 'reportes-asociados', component: ListadogeneralComponent },
      { path: 'informacion-anuc', component: EmpresainfoComponent },
      { path: 'unidades-anuc', component: InformaciondesplegableComponent },
      { path: 'veredas-anuc', component: VeredasComponent },
      { path: 'productos-categorias', component: ProductoscategoriasComponent },
      { path: 'categorias-productos', component: CategoriasproductosComponent },
      { path: 'parentescos-anuc', component: ParentescosComponent },

    ]
  },
  { path: 'gestionproductos', component: GestionarproductosComponent },
  { path: 'publicaroferta', component: PublicarofertaComponent },
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
