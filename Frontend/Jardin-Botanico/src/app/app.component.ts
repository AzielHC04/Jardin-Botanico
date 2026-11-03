import {
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterOutlet
} from '@angular/router';

import {
  NavbarComponent
} from './shared/navbar/navbar.component';

import {
  EventoGaleriaPublicaComponent
} from './shared/evento-galeria-publica/evento-galeria-publica.component';


@Component({
  selector:
    'app-root',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    EventoGaleriaPublicaComponent
  ],

  templateUrl:
    './app.component.html',

  styleUrl:
    './app.component.css'
})
export class AppComponent {

  title:
    string =
      'Jardin-Botanico';

}