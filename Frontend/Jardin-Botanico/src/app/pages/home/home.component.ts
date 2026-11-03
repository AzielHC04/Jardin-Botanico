import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


interface ExperienciaDestacada {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  ruta: string;
}


interface EventoDestacado {
  id: number;
  titulo: string;
  descripcion: string;
  horario: string;
  precio: string;
  imagen: string;
}


@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  /* =========================================================
     HERO
     ========================================================= */

  bannerImages: string[] = [
    'assets/b.jpg',
    'assets/J.jpg',
    'assets/imagenes/jazz.jpg'
  ];

  currentBannerIndex: number = 0;

  private bannerInterval?: ReturnType<typeof setInterval>;


  /* =========================================================
     EXPERIENCIAS DESTACADAS
     ========================================================= */

  experienciasDestacadas: ExperienciaDestacada[] = [

    {
      id: 1,

      titulo: 'Recorridos por el Jardín',

      descripcion:
        'Descubre la riqueza natural del Jardín Botánico de Teya mediante recorridos y experiencias de interpretación.',

      imagen: 'assets/J.jpg',

      ruta: '/jardin'
    },

    {
      id: 2,

      titulo: 'Gastronomía Yucateca',

      descripcion:
        'Conoce los sabores tradicionales de Yucatán y la propuesta gastronómica que forma parte de la experiencia Teya.',

      imagen: 'assets/b.jpg',

      ruta: '/gastronomia'
    },

    {
      id: 3,

      titulo: 'Experiencias Especiales',

      descripcion:
        'Actividades culturales, naturales y experiencias diseñadas para disfrutar Teya de una manera diferente.',

      imagen: 'assets/imagenes/jazz.jpg',

      ruta: '/experiencias'
    }

  ];


  /* =========================================================
     EVENTOS DESTACADOS

     Por ahora son datos locales.
     Posteriormente serán obtenidos desde el backend.
     ========================================================= */

  eventosDestacados: EventoDestacado[] = [

    {
      id: 1,

      titulo: 'Taller de Cerámica Botánica',

      descripcion:
        'Crea tus propias piezas inspiradas en formas y elementos naturales del jardín.',

      horario: '10:00 AM - 12:00 PM',

      precio: '$250 MXN',

      imagen: 'assets/J.jpg'
    },

    {
      id: 2,

      titulo: 'Recorrido Informativo Guiado',

      descripcion:
        'Conoce la naturaleza, la historia y los espacios que forman parte de Teya.',

      horario: '04:00 PM - 05:30 PM',

      precio: '$80 MXN',

      imagen: 'assets/J.jpg'
    },

    {
      id: 3,

      titulo: 'Cena Yucateca Tradicional',

      descripcion:
        'Una experiencia gastronómica inspirada en la cocina tradicional de Yucatán.',

      horario: '08:00 PM - 10:30 PM',

      precio: '$650 MXN',

      imagen: 'assets/J.jpg'
    }

  ];


  /* =========================================================
     CICLO DE VIDA
     ========================================================= */

  ngOnInit(): void {

    if (this.bannerImages.length <= 1) {
      return;
    }

    this.bannerInterval = setInterval(() => {

      this.currentBannerIndex =
        (this.currentBannerIndex + 1)
        % this.bannerImages.length;

    }, 5000);

  }


  ngOnDestroy(): void {

    if (this.bannerInterval) {

      clearInterval(this.bannerInterval);

    }

  }

}