import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


interface ColeccionBotanica {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  etiqueta: string;
}


interface PilarJardin {
  id: number;
  titulo: string;
  descripcion: string;
}


@Component({
  selector: 'app-jardin',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './jardin.component.html',
  styleUrl: './jardin.component.css'
})
export class JardinComponent {

  /* =========================================================
     PILARES
     ========================================================= */

  pilares: PilarJardin[] = [

    {
      id: 1,

      titulo: 'Conservación',

      descripcion:
        'Promover el cuidado, conocimiento y valoración de las especies vegetales que forman parte de las colecciones del jardín.'
    },

    {
      id: 2,

      titulo: 'Divulgación',

      descripcion:
        'Acercar la información botánica a los visitantes mediante herramientas accesibles, recorridos y recursos digitales.'
    },

    {
      id: 3,

      titulo: 'Experiencia',

      descripcion:
        'Crear un espacio donde naturaleza, patrimonio y aprendizaje formen parte de una misma visita.'
    }

  ];


  /* =========================================================
     COLECCIONES

     Son datos provisionales de presentación.
     Posteriormente podrán administrarse desde el backend.
     ========================================================= */

  colecciones: ColeccionBotanica[] = [

    {
      id: 1,

      titulo:
        'Colección de Orquídeas',

      descripcion:
        'Una colección dedicada a distintas especies de orquídeas, acompañada por un sistema de identificación digital mediante códigos QR.',

      imagen:
        'assets/J.jpg',

      etiqueta:
        'Orquídeas'
    },

    {
      id: 2,

      titulo:
        'Flora de la Región',

      descripcion:
        'Espacios destinados a mostrar y valorar especies vegetales relacionadas con el entorno natural de Yucatán.',

      imagen:
        'assets/b.jpg',

      etiqueta:
        'Flora regional'
    },

    {
      id: 3,

      titulo:
        'Colecciones Especiales',

      descripcion:
        'Áreas del jardín que reúnen especies seleccionadas por su valor botánico, ornamental o educativo.',

      imagen:
        'assets/J.jpg',

      etiqueta:
        'Colecciones'
    }

  ];

}