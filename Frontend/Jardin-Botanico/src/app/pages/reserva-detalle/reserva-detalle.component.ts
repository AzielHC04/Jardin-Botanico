import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  SupabaseService
} from '../../core/services/supabase.service';

import {
  Evento
} from '../../core/models/evento.model';


@Component({
  selector: 'app-reserva-detalle',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './reserva-detalle.component.html',

  styleUrl:
    './reserva-detalle.component.css'
})
export class ReservaDetalleComponent
implements OnInit {


  /* =========================================================
     EVENTO
     ========================================================= */

  evento:
    Evento | null = null;


  /* =========================================================
     ESTADOS
     ========================================================= */

  cargando:
    boolean = true;


  errorCarga:
    boolean = false;


  mostrarAvisoReserva:
    boolean = false;


  /* =========================================================
     CONSTRUCTOR
     ========================================================= */

  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private supabaseService:
      SupabaseService

  ) {}


  /* =========================================================
     CICLO DE VIDA
     ========================================================= */

  async ngOnInit():
    Promise<void> {

    const id =
      this.route
        .snapshot
        .paramMap
        .get('id');


    if (!id) {

      await this.router.navigate([
        '/eventos'
      ]);

      return;

    }


    await this.cargarEvento(
      id
    );

  }


  /* =========================================================
     CARGAR EVENTO
     ========================================================= */

  private async cargarEvento(
    id: string
  ): Promise<void> {

    this.cargando =
      true;

    this.errorCarga =
      false;


    try {

      this.evento =
        await this.supabaseService
          .obtenerEventoPorId(
            id
          );


      if (!this.evento) {

        this.errorCarga =
          true;

      }

    }
    catch (error) {

      console.error(
        'No fue posible cargar el evento:',
        error
      );


      this.evento =
        null;

      this.errorCarga =
        true;

    }
    finally {

      this.cargando =
        false;

    }

  }


  /* =========================================================
     FECHA
     ========================================================= */

  get fechaEvento():
    string {

    if (!this.evento) {

      return '';

    }


    const fecha =
      new Date(
        this.evento.fecha_inicio
      );


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
      .format(fecha);

  }


  /* =========================================================
     HORARIO
     ========================================================= */

  get horarioEvento():
    string {

    if (!this.evento) {

      return '';

    }


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
          this.evento.fecha_inicio
        )
      );


    if (
      !this.evento.fecha_fin
    ) {

      return inicio;

    }


    const fin =
      formatter.format(
        new Date(
          this.evento.fecha_fin
        )
      );


    return `${inicio} - ${fin}`;

  }


  /* =========================================================
     PRECIO
     ========================================================= */

  get precioEvento():
    string {

    if (!this.evento) {

      return '';

    }


    /*
     * Un texto especial tiene prioridad.
     *
     * Ejemplos:
     * "Entrada libre"
     * "Consultar"
     */

    if (
      this.evento.precio_texto
    ) {

      return this.evento.precio_texto;

    }


    if (
      this.evento.precio ===
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
          this.evento.moneda,

        minimumFractionDigits:
          0,

        maximumFractionDigits:
          2

      }
    )
      .format(
        this.evento.precio
      );

  }


  /* =========================================================
     ETIQUETA
     ========================================================= */

  get etiquetaEvento():
    string {

    if (!this.evento) {

      return '';

    }


    if (
      this.evento.etiqueta
    ) {

      return this.evento.etiqueta;

    }


    if (
      this.evento.tipo ===
      'especial'
    ) {

      return 'Evento especial';

    }


    return 'Experiencia Teya';

  }


  /* =========================================================
     RESERVA

     Temporal hasta conectar formulario + Clip.
     ========================================================= */

  continuarReserva():
    void {

    this.mostrarAvisoReserva =
      true;

  }

}