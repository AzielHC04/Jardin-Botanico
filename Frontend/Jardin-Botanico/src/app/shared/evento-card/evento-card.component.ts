import {
  Component,
  Input
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


export interface EventoCardData {

  id: string;

  titulo: string;

  descripcion: string;

  horario: string;

  precio: string;

  imagen: string;

  etiqueta?: string;

  cupoTotal?: number;

}


@Component({
  selector: 'app-evento-card',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './evento-card.component.html',

  styleUrl:
    './evento-card.component.css'
})
export class EventoCardComponent {

  @Input({
    required: true
  })
  evento!: EventoCardData;

}