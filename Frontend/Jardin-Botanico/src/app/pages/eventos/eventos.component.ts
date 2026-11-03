import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  horario: string;
  precio: string;
  imagen: string;

  categoria:
    | 'hoy'
    | 'proximos'
    | 'pasados';

  cuposLimites?: number;
}


interface EventoEspecial {
  id: number;
  titulo: string;
  subtitulo: string;
  fecha: string;
  descripcion: string;
  imagen: string;
  etiqueta: string;
}


@Component({
  selector: 'app-eventos',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent implements OnInit, OnDestroy {

  /* =========================================================
     FILTROS
     ========================================================= */

  filtroActual:
    | 'hoy'
    | 'proximos'
    | 'pasados' = 'hoy';


  eventosFiltrados: Evento[] = [];

  activeIndex: number = 0;
  private carouselInterval?: ReturnType<typeof setInterval>;

  private readonly carouselDelay = 5000;


  /* =========================================================
     EVENTOS

     Actualmente son datos de demostración.
     Posteriormente vendrán desde el backend.
     ========================================================= */

  eventos: Evento[] = [

    {
      id: 1,

      titulo:
        'Taller de Cerámica Botánica',

      descripcion:
        'Crea tus propias macetas de arcilla decoradas con relieve de hojas reales del jardín.',

      horario:
        '10:00 AM - 12:00 PM',

      precio:
        '$250 MXN',

      imagen:
        'assets/J.jpg',

      categoria:
        'hoy',

      cuposLimites: 4
    },


    {
      id: 2,

      titulo:
        'Recorrido Informativo Guiado',

      descripcion:
        'Paseo guiado para conocer la historia, el entorno y los jardines de Teya.',

      horario:
        '04:00 PM - 05:30 PM',

      precio:
        'Entrada General ($80 MXN)',

      imagen:
        'assets/J.jpg',

      categoria:
        'hoy'
    },


    {
      id: 3,

      titulo:
        'Cena Yucateca Tradicional',

      descripcion:
        'Experiencia gastronómica inspirada en la cocina tradicional yucateca.',

      horario:
        '08:00 PM - 10:30 PM',

      precio:
        '$650 MXN',

      imagen:
        'assets/J.jpg',

      categoria:
        'hoy',

      cuposLimites: 2
    },


    {
      id: 4,

      titulo:
        'Exposición de Orquídeas Exóticas',

      descripcion:
        'Muestra especial dedicada a distintas especies de orquídeas y su riqueza botánica.',

      horario:
        '11:00 AM - 03:00 PM',

      precio:
        '$120 MXN',

      imagen:
        'assets/J.jpg',

      categoria:
        'proximos'
    },


    {
      id: 5,

      titulo:
        'Noche de Fotografías Nocturnas',

      descripcion:
        'Taller práctico de fotografía de larga exposición recorriendo distintos espacios de Teya.',

      horario:
        '07:00 PM - 09:00 PM',

      precio:
        '$300 MXN',

      imagen:
        'assets/J.jpg',

      categoria:
        'pasados'
    }

  ];


  /* =========================================================
     EVENTOS ESPECIALES
     ========================================================= */

  eventosEspeciales: EventoEspecial[] = [

    {
      id: 101,

      titulo:
        'Noches de Jazz en la Hacienda',

      subtitulo:
        'Música en vivo & Coctelería Yucateca',

      fecha:
        'Próxima edición',

      descripcion:
        'Disfruta de música en vivo rodeado de la iluminación nocturna de los jardines y espacios de Teya.',

      imagen:
        'assets/imagenes/jazz.jpg',

      etiqueta:
        'Especial'
    },


    {
      id: 102,

      titulo:
        'Gran Gala Yucateca',

      subtitulo:
        'Tradición, Jarana & Gastronomía',

      fecha:
        'Fecha por confirmar',

      descripcion:
        'Una celebración especial inspirada en las tradiciones, música y gastronomía de Yucatán.',

      imagen:
        'assets/J.jpg',

      etiqueta:
        'Tradicional'
    },


    {
      id: 103,

      titulo:
        'Boda Muestra & Expo Eventos',

      subtitulo:
        'Montajes Exclusivos & Recorrido por Jardines',

      fecha:
        'Edición especial',

      descripcion:
        'Conoce espacios, montajes y propuestas para la realización de celebraciones y eventos.',

      imagen:
        'assets/J.jpg',

      etiqueta:
        'Especial'
    }

  ];


  /* =========================================================
     CICLO DE VIDA
     ========================================================= */

  ngOnInit(): void {

    this.actualizarFiltro();
    this.iniciarCarruselAutomatico();
  }

  ngOnDestroy(): void {

    this.detenerCarruselAutomatico();

  }

  /* =========================================================
     FILTRADO
     ========================================================= */

  setFiltro(
    categoria:
      | 'hoy'
      | 'proximos'
      | 'pasados'
  ): void {

    this.filtroActual = categoria;

    this.actualizarFiltro();

    this.iniciarCarruselAutomatico();

  }


  private actualizarFiltro(): void {

    this.eventosFiltrados =
      this.eventos.filter(
        evento =>
          evento.categoria ===
          this.filtroActual
      );

    this.activeIndex = 0;

  }

  private iniciarCarruselAutomatico(): void {

  this.detenerCarruselAutomatico();


    if (this.eventosFiltrados.length <= 1) {
      return;
    }


    this.carouselInterval = setInterval(() => {

      this.activeIndex =
        (
          this.activeIndex + 1
        )
        %
        this.eventosFiltrados.length;

    }, this.carouselDelay);

  }


  private detenerCarruselAutomatico(): void {

    if (this.carouselInterval) {

      clearInterval(this.carouselInterval);

      this.carouselInterval = undefined;

    }

  }

  /* =========================================================
     CARRUSEL
     ========================================================= */

  siguiente(): void {

    if (this.eventosFiltrados.length <= 1) {
      return;
    }


    this.activeIndex =
      (
        this.activeIndex + 1
      )
      %
      this.eventosFiltrados.length;


    this.iniciarCarruselAutomatico();

  }


  anterior(): void {

    if (this.eventosFiltrados.length <= 1) {
      return;
    }


    this.activeIndex =
      (
        this.activeIndex
        - 1
        + this.eventosFiltrados.length
      )
      %
      this.eventosFiltrados.length;


    this.iniciarCarruselAutomatico();

  }


  setCardActive(
    index: number
  ): void {

    this.activeIndex = index;
    this.iniciarCarruselAutomatico();
  }


  getCardClass(
    index: number
  ): string {

    const total =
      this.eventosFiltrados.length;


    if (total === 0) {

      return '';

    }


    if (
      index ===
      this.activeIndex
    ) {

      return 'card-center';

    }


    const prevIndex =
      (
        this.activeIndex
        - 1
        + total
      )
      % total;


    const nextIndex =
      (
        this.activeIndex
        + 1
      )
      % total;


    if (
      index ===
      prevIndex
    ) {

      return 'card-left';

    }


    if (
      index ===
      nextIndex
    ) {

      return 'card-right';

    }


    return 'card-hidden';

  }


  /* =========================================================
     EVENTOS ESPECIALES

     Esto es temporal. Después podemos convertirlo en
     navegación, formulario o información desde backend.
     ========================================================= */

  solicitarInformacionEspecial(
    especial: EventoEspecial
  ): void {

    alert(
      `Solicitaste información sobre: ${especial.titulo}`
    );

  }

}