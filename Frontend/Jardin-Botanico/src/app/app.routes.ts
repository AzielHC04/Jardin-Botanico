import {
  Routes
} from '@angular/router';

import {
  HomeComponent
} from './pages/home/home.component';

import {
  ReservaDetalleComponent
} from './pages/reserva-detalle/reserva-detalle.component';

import {
  ExperienciasComponent
} from './pages/experiencias/experiencias.component';

import {
  ExperienciaDetalleComponent
} from './pages/experiencia-detalle/experiencia-detalle.component';

import {
  EventosComponent
} from './pages/eventos/eventos.component';

import {
  JardinComponent
} from './pages/jardin/jardin.component';

import {
  ContactoComponent
} from './pages/contacto/contacto.component';

import {
  AdminLoginComponent
} from './pages/admin-login/admin-login.component';

import {
  AdminDashboardComponent
} from './pages/admin-dashboard/admin-dashboard.component';

import {
  AdminReservasComponent
} from './pages/admin-reservas/admin-reservas.component';

import {
  AdminEventosComponent
} from './pages/admin-eventos/admin-eventos.component';

import {
  AdminExperienciasComponent
} from './pages/admin-experiencias/admin-experiencias.component';

import {
  AdminContenidoComponent
} from './pages/admin-contenido/admin-contenido.component';

import {
  AdminJardinComponent
} from './pages/admin-jardin/admin-jardin.component';

import {
  adminGuard
} from './core/guards/admin.guard';


export const routes:
  Routes = [


  /* =========================================================
     PÚBLICO
     ========================================================= */

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },


  {
    path: 'home',
    component: HomeComponent
  },


  {
    path: 'experiencias',
    component: ExperienciasComponent
  },


  {
    path: 'experiencia/:id',
    component: ExperienciaDetalleComponent
  },


  {
    path: 'eventos',
    component: EventosComponent
  },


  {
    path: 'jardin',
    component: JardinComponent
  },


  {
    path: 'contacto',
    component: ContactoComponent
  },


  {
    path: 'reserva/:id',
    component: ReservaDetalleComponent
  },


  {
    path: 'gastronomia',
    redirectTo: 'experiencias',
    pathMatch: 'full'
  },


  /* =========================================================
     ADMIN
     ========================================================= */

  {
    path: 'admin/login',
    component: AdminLoginComponent
  },


  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [
      adminGuard
    ]
  },


  {
    path: 'admin/reservas',
    component: AdminReservasComponent,
    canActivate: [
      adminGuard
    ]
  },


  {
    path: 'admin/eventos',
    component: AdminEventosComponent,
    canActivate: [
      adminGuard
    ]
  },


  {
    path: 'admin/experiencias',
    component: AdminExperienciasComponent,
    canActivate: [
      adminGuard
    ]
  },


  {
    path: 'admin/contenido',
    component: AdminContenidoComponent,
    canActivate: [
      adminGuard
    ]
  },


  {
    path: 'admin/jardin',
    component: AdminJardinComponent,
    canActivate: [
      adminGuard
    ]
  },


  /* =========================================================
     FALLBACK
     ========================================================= */

  {
    path: '**',
    redirectTo: 'home'
  }

];