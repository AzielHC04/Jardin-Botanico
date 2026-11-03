import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  EventoCardComponent
} from '../../shared/evento-card/evento-card.component';

import {
  SupabaseService
} from '../../core/services/supabase.service';

import {
  Evento
} from '../../core/models/evento.model';


type FiltroEvento =
  | 'hoy'
  | 'proximos'
  | 'pasados';


interface EventoVista {

  id: string;

  titulo: string;

  descripcion: string;

  fecha: string;

  horario: string;

  precio: string;

  imagen: string;

  etiqueta: string;

  cupoTotal:
    number | null;

  categoria:
    FiltroEvento;

}


interface EventoEspecialVista {

  id: string;

  titulo: string;

  descripcion: string;

  fecha: string;

  horario: string;

  precio: string;

  imagen: string;

  etiqueta: string;

  cupoTotal:
    number | null;

}


@Component({
  selector:
    'app-eventos',

  standalone:
    true,

  imports: [
    CommonModule,
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
     DATOS
     ========================================================= */

  eventos:
    EventoVista[] = [];


  eventosEspeciales:
    EventoEspecialVista[] = [];


  filtroActual:
    FiltroEvento =
      'proximos';


  activeIndex:
    number = 0;


  cargando:
    boolean = true;


  errorCarga:
    boolean = false;


  /* =========================================================
     CARRUSEL
     ========================================================= */

  private intervalo:
    ReturnType<typeof setInterval>
    | null = null;


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     INICIO
     ========================================================= */

  async ngOnInit():
    Promise<void> {

    await this.cargarEventos();

  }


  ngOnDestroy():
    void {

    this.detenerCarrusel();

  }


  /* =========================================================
     EVENTOS FILTRADOS
     ========================================================= */

  get eventosFiltrados():
    EventoVista[] {

    return this.eventos
      .filter(
        evento =>
          evento.categoria
          === this.filtroActual
      );

  }


  /* =========================================================
     CARGAR SUPABASE
     ========================================================= */

  private async cargarEventos():
    Promise<void> {

    this.cargando =
      true;


    this.errorCarga =
      false;


    try {

      const eventos =
        await this.supabaseService
          .obtenerEventosActivos();


      const ordenados =
        [...eventos]
          .sort(
            (
              a,
              b
            ) =>
              new Date(
                a.fecha_inicio
              ).getTime()
              -
              new Date(
                b.fecha_inicio
              ).getTime()
          );


      this.eventos =
        ordenados
          .filter(
            evento =>
              evento.tipo
              === 'regular'
          )
          .map(
            evento =>
              this.crearEventoVista(
                evento
              )
          );


      this.eventosEspeciales =
        ordenados
          .filter(
            evento =>
              evento.tipo
              === 'especial'
          )
          .map(
            evento =>
              this.crearEventoEspecialVista(
                evento
              )
          );


      const hayHoy =
        this.eventos
          .some(
            evento =>
              evento.categoria
              === 'hoy'
          );


      this.filtroActual =
        hayHoy
          ? 'hoy'
          : 'proximos';


      this.activeIndex =
        0;


      this.iniciarCarrusel();

    }
    catch (error) {

      console.error(
        'No fue posible cargar los eventos:',
        error
      );


      this.eventos =
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
     CONVERTIR EVENTO REGULAR
     ========================================================= */

  private crearEventoVista(
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

      fecha:
        this.formatearFecha(
          evento.fecha_inicio
        ),

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
        || 'assets/J.jpg',

      etiqueta:
        evento.etiqueta
        || 'Evento',

      cupoTotal:
        evento.cupo_total,

      categoria:
        this.obtenerCategoria(
          evento.fecha_inicio
        )

    };

  }


  /* =========================================================
     CONVERTIR EVENTO ESPECIAL
     ========================================================= */

  private crearEventoEspecialVista(
    evento:
      Evento
  ): EventoEspecialVista {

    return {

      id:
        evento.id,

      titulo:
        evento.titulo,

      descripcion:
        evento.descripcion,

      fecha:
        this.formatearFecha(
          evento.fecha_inicio
        ),

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
        || 'assets/J.jpg',

      etiqueta:
        evento.etiqueta
        || 'Especial',

      cupoTotal:
        evento.cupo_total

    };

  }


  /* =========================================================
     FILTROS
     ========================================================= */

  cambiarFiltro(
    filtro:
      FiltroEvento
  ): void {

    this.filtroActual =
      filtro;


    this.activeIndex =
      0;


    this.reiniciarCarrusel();

  }


  cantidadFiltro(
    filtro:
      FiltroEvento
  ): number {

    return this.eventos
      .filter(
        evento =>
          evento.categoria
          === filtro
      )
      .length;

  }


  /* =========================================================
     CARRUSEL
     ========================================================= */

  siguiente():
    void {

    const total =
      this.eventosFiltrados.length;


    if (
      total <= 1
    ) {

      return;

    }


    this.activeIndex =
      (
        this.activeIndex
        + 1
      )
      %
      total;


    this.reiniciarCarrusel();

  }


  anterior():
    void {

    const total =
      this.eventosFiltrados.length;


    if (
      total <= 1
    ) {

      return;

    }


    this.activeIndex =
      (
        this.activeIndex
        - 1
        + total
      )
      %
      total;


    this.reiniciarCarrusel();

  }


  setCardActive(
    index:
      number
  ): void {

    this.activeIndex =
      index;


    this.reiniciarCarrusel();

  }


  irAEvento(
    index:
      number
  ): void {

    this.activeIndex =
      index;


    this.reiniciarCarrusel();

  }


  private iniciarCarrusel():
    void {

    this.detenerCarrusel();


    if (
      this.eventosFiltrados.length
      <= 1
    ) {

      return;

    }


    this.intervalo =
      setInterval(
        () => {

          const total =
            this.eventosFiltrados.length;


          if (
            total <= 1
          ) {

            return;

          }


          this.activeIndex =
            (
              this.activeIndex
              + 1
            )
            %
            total;

        },
        5000
      );

  }


  private reiniciarCarrusel():
    void {

    this.iniciarCarrusel();

  }


  private detenerCarrusel():
    void {

    if (
      this.intervalo
    ) {

      clearInterval(
        this.intervalo
      );


      this.intervalo =
        null;

    }

  }


  /* =========================================================
     CATEGORÍA POR FECHA
     ========================================================= */

  private obtenerCategoria(
    fecha:
      string
  ): FiltroEvento {

    const hoy =
      this.fechaLocalComparable(
        new Date()
      );


    const evento =
      this.fechaLocalComparable(
        new Date(
          fecha
        )
      );


    if (
      evento === hoy
    ) {

      return 'hoy';

    }


    if (
      evento > hoy
    ) {

      return 'proximos';

    }


    return 'pasados';

  }


  private fechaLocalComparable(
    fecha:
      Date
  ): string {

    const partes =
      new Intl.DateTimeFormat(
        'en-CA',
        {

          year:
            'numeric',

          month:
            '2-digit',

          day:
            '2-digit',

          timeZone:
            'America/Merida'

        }
      )
        .formatToParts(
          fecha
        );


    const year =
      partes.find(
        parte =>
          parte.type
          === 'year'
      )
        ?.value
      || '0000';


    const month =
      partes.find(
        parte =>
          parte.type
          === 'month'
      )
        ?.value
      || '00';


    const day =
      partes.find(
        parte =>
          parte.type
          === 'day'
      )
        ?.value
      || '00';


    return `${year}-${month}-${day}`;

  }


  /* =========================================================
     FORMATO FECHA
     ========================================================= */

  private formatearFecha(
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

        year:
          'numeric',

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


  /* =========================================================
     FORMATO HORARIO
     ========================================================= */

  private formatearHorario(
    inicio:
      string,

    fin:
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


    const horaInicio =
      formatter.format(
        new Date(
          inicio
        )
      );


    if (
      !fin
    ) {

      return horaInicio;

    }


    const horaFin =
      formatter.format(
        new Date(
          fin
        )
      );


    return `${horaInicio} - ${horaFin}`;

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
      evento.precio === null
      ||
      evento.precio === undefined
    ) {

      return 'Consultar';

    }


    return new Intl.NumberFormat(
      'es-MX',
      {

        style:
          'currency',

        currency:
          evento.moneda
          || 'MXN',

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

}