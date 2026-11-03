import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ExperienciasComponent } from './pages/experiencias/experiencias.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { JardinComponent } from './pages/jardin/jardin.component';
import { ContactoComponent } from './pages/contacto/contacto.component';

import { GastronomiaComponent } from './pages/gastronomia/gastronomia.component';
import { ReservaDetalleComponent } from './pages/reserva-detalle/reserva-detalle.component';

export const routes: Routes = [

  // Página principal
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },

  {
    path: 'home',
    component: HomeComponent,
    title: 'Inicio | Jardín Botánico de Teya'
  },

  // Secciones principales
  {
    path: 'experiencias',
    component: ExperienciasComponent,
    title: 'Experiencias | Jardín Botánico de Teya'
  },

  {
    path: 'eventos',
    component: EventosComponent,
    title: 'Eventos | Jardín Botánico de Teya'
  },

  {
    path: 'jardin',
    component: JardinComponent,
    title: 'Jardín Botánico | Hacienda Teya'
  },

  {
    path: 'contacto',
    component: ContactoComponent,
    title: 'Contacto | Jardín Botánico de Teya'
  },

  // Página existente de gastronomía
  {
    path: 'gastronomia',
    component: GastronomiaComponent,
    title: 'Gastronomía | Hacienda Teya'
  },

  // Detalle de una reserva o evento
  {
    path: 'reserva/:id',
    component: ReservaDetalleComponent,
    title: 'Detalle de reserva | Hacienda Teya'
  },

  // Cualquier URL que no exista regresa al Home
  {
    path: '**',
    redirectTo: 'home'
  }

];