import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  SupabaseService
} from '../../core/services/supabase.service';

import {
  Evento
} from '../../core/models/evento.model';

import {
  EventoCardComponent
} from '../../shared/evento-card/evento-card.component';


type CategoriaEvento =
  | 'hoy'
  | 'proximos'
  | 'pasados';


interface EventoVista {

  id: string;

  titulo: string;

  descripcion: string;

  horario: string;

  precio: string;

  imagen: string;

  etiqueta?: string;

  categoria:
    CategoriaEvento;

  cupoTotal?: number;

}


interface EventoEspecialVista {

  id: string;

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
    RouterLink,
    EventoCardComponent
  ],

  templateUrl:
    './eventos.component.html',

  styleUrl:
    './eventos.component.css'
})
export class EventosComponent
implements OnInit, OnDestroy {


  /* =========================================================
     EVENTOS
     ========================================================= */

  eventos:
    EventoVista[] = [];


  eventosFiltrados:
    EventoVista[] = [];


  eventosEspeciales:
    EventoEspecialVista[] = [];


  /* =========================================================
     FILTRO
     ========================================================= */

  filtroActual:
    CategoriaEvento =
      'hoy';


  /* =========================================================
     CARRUSEL
     ========================================================= */

  activeIndex:
    number = 0;


  private carouselInterval?:
    ReturnType<typeof setInterval>;


  private readonly carouselDelay:
    number = 5000;


  /* =========================================================
     ESTADOS
     ========================================================= */

  cargando:
    boolean = true;


  errorCarga:
    boolean = false;


  /* =========================================================
     CONSTRUCTOR
     ========================================================= */

  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     CICLO DE VIDA
     ========================================================= */

  async ngOnInit():
    Promise<void> {

    await this.cargarEventos();

  }


  ngOnDestroy():
    void {

    this.detenerCarruselAutomatico();

  }


  /* =========================================================
     SUPABASE
     ========================================================= */

  private async cargarEventos():
    Promise<void> {

    this.cargando =
      true;

    this.errorCarga =
      false;


    try {

      const eventosSupabase:
        Evento[] =
          await this.supabaseService
            .obtenerEventosActivos();


      const eventosRegulares =
        eventosSupabase.filter(
          evento =>
            evento.tipo ===
            'regular'
        );


      const especiales =
        eventosSupabase.filter(
          evento =>
            evento.tipo ===
            'especial'
        );


      this.eventos =
        eventosRegulares.map(
          evento =>
            this.convertirEventoRegular(
              evento
            )
        );


      this.eventosEspeciales =
        especiales.map(
          evento =>
            this.convertirEventoEspecial(
              evento
            )
        );


      /*
       * Si hoy no hay eventos,
       * mostramos Próximos automáticamente.
       */

      const existenHoy =
        this.eventos.some(
          evento =>
            evento.categoria ===
            'hoy'
        );


      if (!existenHoy) {

        this.filtroActual =
          'proximos';

      }


      this.actualizarFiltro();

      this.iniciarCarruselAutomatico();

    }
    catch (error) {

      console.error(
        'Error al cargar eventos:',
        error
      );


      this.eventos =
        [];

      this.eventosFiltrados =
        [];

      this.eventosEspeciales =
        [];

      this.errorCarga =
        true;

    }
    finally {

      this.cargando =
        false;

    }

  }


  /* =========================================================
     EVENTO REGULAR
     ========================================================= */

  private convertirEventoRegular(
    evento:
      Evento
  ): EventoVista {

    return {

      id:
        evento.id,

      titulo:
        evento.titulo,

      descripcion:
        evento.descripcion,

      horario:
        this.formatearHorario(
          evento.fecha_inicio,
          evento.fecha_fin
        ),

      precio:
        this.formatearPrecio(
          evento
        ),

      imagen:
        evento.imagen_url
        ?? 'assets/J.jpg',

      etiqueta:
        evento.etiqueta
        ?? undefined,

      categoria:
        this.obtenerCategoria(
          evento
        ),

      cupoTotal:
        evento.cupo_total
        ?? undefined

    };

  }


  /* =========================================================
     EVENTO ESPECIAL
     ========================================================= */

  private convertirEventoEspecial(
    evento:
      Evento
  ): EventoEspecialVista {

    return {

      id:
        evento.id,

      titulo:
        evento.titulo,

      subtitulo:
        evento.subtitulo
        ?? '',

      fecha:
        this.formatearFechaEspecial(
          evento.fecha_inicio
        ),

      descripcion:
        evento.descripcion,

      imagen:
        evento.imagen_url
        ?? 'assets/J.jpg',

      etiqueta:
        evento.etiqueta
        ?? 'Especial'

    };

  }


  /* =========================================================
     CATEGORÍA AUTOMÁTICA
     ========================================================= */

  private obtenerCategoria(
    evento:
      Evento
  ): CategoriaEvento {

    const ahora =
      new Date();


    const inicio =
      new Date(
        evento.fecha_inicio
      );


    const fin =
      evento.fecha_fin
        ? new Date(
            evento.fecha_fin
          )
        : inicio;


    const fechaHoy =
      this.obtenerFechaLocal(
        ahora
      );


    const fechaInicio =
      this.obtenerFechaLocal(
        inicio
      );


    /*
     * Evento que comienza hoy.
     */

    if (
      fechaInicio ===
      fechaHoy
    ) {

      return 'hoy';

    }


    /*
     * Evento que aún no comienza.
     */

    if (
      inicio > ahora
    ) {

      return 'proximos';

    }


    /*
     * Evento terminado.
     */

    if (
      fin < ahora
    ) {

      return 'pasados';

    }


    /*
     * Evento de varios días
     * todavía activo.
     */

    return 'hoy';

  }


  private obtenerFechaLocal(
    fecha:
      Date
  ): string {

    return new Intl.DateTimeFormat(
      'en-CA',
      {

        timeZone:
          'America/Merida',

        year:
          'numeric',

        month:
          '2-digit',

        day:
          '2-digit'

      }
    )
      .format(
        fecha
      );

  }


  /* =========================================================
     FILTROS
     ========================================================= */

  setFiltro(
    categoria:
      CategoriaEvento
  ): void {

    this.filtroActual =
      categoria;


    this.actualizarFiltro();


    this.iniciarCarruselAutomatico();

  }


  private actualizarFiltro():
    void {

    this.eventosFiltrados =
      this.eventos.filter(
        evento =>
          evento.categoria ===
          this.filtroActual
      );


    this.activeIndex =
      0;

  }


  /* =========================================================
     CLASE DEL CARRUSEL
     ========================================================= */

  getCardClass(
    index:
      number
  ): string {

    const total =
      this.eventosFiltrados.length;


    if (
      total === 0
    ) {

      return 'card-hidden';

    }


    if (
      index ===
      this.activeIndex
    ) {

      return 'card-center';

    }


    const anterior =
      (
        this.activeIndex
        - 1
        + total
      )
      %
      total;


    const siguiente =
      (
        this.activeIndex
        + 1
      )
      %
      total;


    if (
      index === anterior
    ) {

      return 'card-left';

    }


    if (
      index === siguiente
    ) {

      return 'card-right';

    }


    return 'card-hidden';

  }


  /* =========================================================
     NAVEGACIÓN
     ========================================================= */

  siguiente():
    void {

    if (
      this.eventosFiltrados.length
      <= 1
    ) {

      return;

    }


    this.activeIndex =
      (
        this.activeIndex
        + 1
      )
      %
      this.eventosFiltrados.length;


    this.iniciarCarruselAutomatico();

  }


  anterior():
    void {

    if (
      this.eventosFiltrados.length
      <= 1
    ) {

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
    index:
      number
  ): void {

    this.activeIndex =
      index;


    this.iniciarCarruselAutomatico();

  }


  /* =========================================================
     CARRUSEL AUTOMÁTICO
     ========================================================= */

  private iniciarCarruselAutomatico():
    void {

    this.detenerCarruselAutomatico();


    if (
      this.eventosFiltrados.length
      <= 1
    ) {

      return;

    }


    this.carouselInterval =
      setInterval(
        () => {

          this.activeIndex =
            (
              this.activeIndex
              + 1
            )
            %
            this.eventosFiltrados.length;

        },
        this.carouselDelay
      );

  }


  private detenerCarruselAutomatico():
    void {

    if (
      this.carouselInterval
    ) {

      clearInterval(
        this.carouselInterval
      );


      this.carouselInterval =
        undefined;

    }

  }


  /* =========================================================
     HORARIO
     ========================================================= */

  private formatearHorario(
    fechaInicio:
      string,

    fechaFin:
      string | null
  ): string {

    const formatter =
      new Intl.DateTimeFormat(
        'es-MX',
        {

          hour:
            '2-digit',

          minute:
            '2-digit',

          hour12:
            true,

          timeZone:
            'America/Merida'

        }
      );


    const inicio =
      formatter.format(
        new Date(
          fechaInicio
        )
      );


    if (
      !fechaFin
    ) {

      return inicio;

    }


    const fin =
      formatter.format(
        new Date(
          fechaFin
        )
      );


    return (
      `${inicio} - ${fin}`
    );

  }


  /* =========================================================
     PRECIO
     ========================================================= */

  private formatearPrecio(
    evento:
      Evento
  ): string {

    if (
      evento.precio_texto
    ) {

      return evento.precio_texto;

    }


    if (
      evento.precio ===
      null
    ) {

      return 'Consultar';

    }


    return new Intl.NumberFormat(
      'es-MX',
      {

        style:
          'currency',

        currency:
          evento.moneda,

        minimumFractionDigits:
          0,

        maximumFractionDigits:
          2

      }
    )
      .format(
        evento.precio
      );

  }


  /* =========================================================
     FECHA ESPECIAL
     ========================================================= */

  private formatearFechaEspecial(
    fecha:
      string
  ): string {

    return new Intl.DateTimeFormat(
      'es-MX',
      {

        weekday:
          'long',

        day:
          'numeric',

        month:
          'long',

        hour:
          '2-digit',

        minute:
          '2-digit',

        hour12:
          true,

        timeZone:
          'America/Merida'

      }
    )
      .format(
        new Date(
          fecha
        )
      );

  }

}