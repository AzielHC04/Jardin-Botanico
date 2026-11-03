import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


interface Experiencia {
  id: number;

  titulo: string;
  subtitulo: string;
  descripcion: string;

  imagen: string;

  categoria:
    | 'naturaleza'
    | 'gastronomia'
    | 'actividad'
    | 'especial';

  etiqueta: string;

  ruta?: string;
}


@Component({
  selector: 'app-experiencias',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './experiencias.component.html',
  styleUrl: './experiencias.component.css'
})
export class ExperienciasComponent {

  /* =========================================================
     EXPERIENCIAS

     Actualmente son datos locales.
     Posteriormente vendrán desde Supabase.
     ========================================================= */

  experiencias: Experiencia[] = [

    {
      id: 1,

      titulo:
        'Recorridos por el Jardín',

      subtitulo:
        'Naturaleza & conocimiento',

      descripcion:
        'Recorre los espacios del Jardín Botánico de Teya y descubre su riqueza vegetal, sus colecciones y la relación entre naturaleza, conservación y patrimonio.',

      imagen:
        'assets/J.jpg',

      categoria:
        'naturaleza',

      etiqueta:
        'Jardín Botánico',

      ruta:
        '/jardin'
    },


    {
      id: 2,

      titulo:
        'Gastronomía Yucateca',

      subtitulo:
        'Tradición & sabores de Yucatán',

      descripcion:
        'Conoce la propuesta gastronómica de Teya y disfruta sabores inspirados en la cocina tradicional yucateca dentro de un entorno histórico y natural.',

      imagen:
        'assets/b.jpg',

      categoria:
        'gastronomia',

      etiqueta:
        'Gastronomía',

      ruta:
        '/gastronomia'
    },


    {
      id: 3,

      titulo:
        'Talleres & Actividades',

      subtitulo:
        'Aprendizaje & creatividad',

      descripcion:
        'Participa en actividades culturales, botánicas y creativas diseñadas para acercar a los visitantes al entorno natural de Teya de una manera diferente.',

      imagen:
        'assets/J.jpg',

      categoria:
        'actividad',

      etiqueta:
        'Actividades'
    },


    {
      id: 4,

      titulo:
        'Experiencias Especiales',

      subtitulo:
        'Momentos únicos en Teya',

      descripcion:
        'Descubre actividades temáticas, noches especiales, eventos culturales y propuestas que combinan naturaleza, patrimonio, música y gastronomía.',

      imagen:
        'assets/imagenes/jazz.jpg',

      categoria:
        'especial',

      etiqueta:
        'Especial',

      ruta:
        '/eventos'
    }

  ];

}