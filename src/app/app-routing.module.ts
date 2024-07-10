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
      { path: 'publicaroferta', component: PublicarofertaComponent }
    ]
  },
  { path: 'administrador', component: AdministradorComponent,
    children: [
      {path: 'adminasociados', component: AdministrarasociadosComponent},
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
