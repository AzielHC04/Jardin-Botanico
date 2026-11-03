import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SupabaseService } from '../../core/services/supabase.service';

import {
  Evento
} from '../../core/models/evento.model';


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

  categoria: CategoriaEvento;

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
    RouterLink
  ],

  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent
implements OnInit, OnDestroy {


  /* =========================================================
     FILTROS
     ========================================================= */

  filtroActual:
    CategoriaEvento = 'hoy';


  eventos:
    EventoVista[] = [];


  eventosFiltrados:
    EventoVista[] = [];


  eventosEspeciales:
    EventoEspecialVista[] = [];


  activeIndex:
    number = 0;


  cargando:
    boolean = true;


  errorCarga:
    boolean = false;


  /* =========================================================
     CARRUSEL
     ========================================================= */

  private carouselInterval?:
    ReturnType<typeof setInterval>;


  private readonly carouselDelay:
    number = 5000;


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     CICLO DE VIDA
     ========================================================= */

  async ngOnInit(): Promise<void> {

    await this.cargarEventos();

  }


  ngOnDestroy(): void {

    this.detenerCarruselAutomatico();

  }


  /* =========================================================
     CARGA DESDE SUPABASE
     ========================================================= */

  private async cargarEventos():
    Promise<void> {

    this.cargando = true;

    this.errorCarga = false;


    try {

      const eventosSupabase:
        Evento[] =
          await this.supabaseService
            .obtenerEventosActivos();


      const regulares =
        eventosSupabase.filter(
          evento =>
            evento.tipo === 'regular'
        );


      const especiales =
        eventosSupabase.filter(
          evento =>
            evento.tipo === 'especial'
        );


      this.eventos =
        regulares.map(
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
       * Si no hay eventos hoy,
       * mostramos próximos automáticamente.
       */

      const hayEventosHoy =
        this.eventos.some(
          evento =>
            evento.categoria === 'hoy'
        );


      if (!hayEventosHoy) {

        this.filtroActual =
          'proximos';

      }


      this.actualizarFiltro();

      this.iniciarCarruselAutomatico();

    }
    catch (error) {

      console.error(
        'No fue posible cargar los eventos:',
        error
      );


      this.errorCarga = true;

      this.eventos = [];

      this.eventosEspeciales = [];

      this.eventosFiltrados = [];

    }
    finally {

      this.cargando = false;

    }

  }


  /* =========================================================
     CONVERSIÓN
     ========================================================= */

  private convertirEventoRegular(
    evento: Evento
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

      categoria:
        this.obtenerCategoria(
          evento
        ),

      cupoTotal:
        evento.cupo_total
        ?? undefined

    };

  }


  private convertirEventoEspecial(
    evento: Evento
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
     CLASIFICACIÓN AUTOMÁTICA
     ========================================================= */

  private obtenerCategoria(
    evento: Evento
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


    /*
     * Comparamos la fecha utilizando
     * la zona horaria de Yucatán.
     */

    const hoyTexto =
      this.obtenerFechaLocal(
        ahora
      );


    const inicioTexto =
      this.obtenerFechaLocal(
        inicio
      );


    if (
      inicioTexto ===
      hoyTexto
    ) {

      return 'hoy';

    }


    if (
      inicio > ahora
    ) {

      return 'proximos';

    }


    if (
      fin < ahora
    ) {

      return 'pasados';

    }


    /*
     * Caso poco común:
     * evento de varios días que ya comenzó
     * pero todavía no termina.
     */

    return 'hoy';

  }


  private obtenerFechaLocal(
    fecha: Date
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
      .format(fecha);

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


    this.activeIndex = 0;

  }


  /* =========================================================
     CARRUSEL
     ========================================================= */

  siguiente(): void {

    if (
      this.eventosFiltrados.length
      <= 1
    ) {

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
    index: number
  ): void {

    this.activeIndex =
      index;


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
              this.activeIndex + 1
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
     FORMATO DE HORARIO
     ========================================================= */

  private formatearHorario(
    fechaInicio: string,
    fechaFin: string | null
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


    if (!fechaFin) {

      return inicio;

    }


    const fin =
      formatter.format(
        new Date(
          fechaFin
        )
      );


    return `${inicio} - ${fin}`;

  }


  /* =========================================================
     FORMATO DE PRECIO
     ========================================================= */

  private formatearPrecio(
    evento: Evento
  ): string {

    if (
      evento.precio_texto
    ) {

      return evento.precio_texto;

    }


    if (
      evento.precio === null
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
     FORMATO EVENTO ESPECIAL
     ========================================================= */

  private formatearFechaEspecial(
    fecha: string
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
        new Date(fecha)
      );

  }


  /* =========================================================
     INFORMACIÓN ESPECIAL

     Todavía temporal.
     Más adelante puede navegar a contacto,
     reserva o un detalle específico.
     ========================================================= */

  solicitarInformacionEspecial(
    especial:
      EventoEspecialVista
  ): void {

    alert(
      `Solicitaste información sobre: ${especial.titulo}`
    );

  }

}