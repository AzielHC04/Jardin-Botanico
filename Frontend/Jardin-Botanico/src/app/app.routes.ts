import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GastronomiaComponent } from './pages/gastronomia/gastronomia.component'; 
import { ReservaDetalleComponent } from './pages/reserva-detalle/reserva-detalle.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'gastronomia', component: GastronomiaComponent },
  { path: 'reserva/:id', component: ReservaDetalleComponent }, 
  { path: '**', redirectTo: '' } // Opcional: redirige cualquier ruta desconocida al Home
]; 