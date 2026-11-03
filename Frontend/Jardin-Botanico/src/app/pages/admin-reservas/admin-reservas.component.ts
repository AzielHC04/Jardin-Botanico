import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  AdminService,
  EstadoReserva,
  ReservaAdmin
} from '../../core/services/admin.service';


type FiltroReserva =
  | 'todas'
  | EstadoReserva;


@Component({
  selector:
    'app-admin-reservas',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './admin-reservas.component.html',

  styleUrl:
    './admin-reservas.component.css'
})
export class AdminReservasComponent
implements OnInit {


  reservas:
    ReservaAdmin[] = [];


  filtroActual:
    FiltroReserva =
      'todas';


  cargando:
    boolean = true;


  errorCarga:
    boolean = false;


  mensajeError:
    string = '';


  reservaActualizandoId:
    string | null = null;


  constructor(
    private adminService:
      AdminService
  ) {}


  async ngOnInit():
    Promise<void> {

    await this.cargarReservas();

  }


  /* =========================================================
     RESERVAS FILTRADAS
     ========================================================= */

  get reservasFiltradas():
    ReservaAdmin[] {

    if (
      this.filtroActual ===
      'todas'
    ) {

      return this.reservas;

    }


    return this.reservas
      .filter(
        reserva =>
          reserva.estado ===
          this.filtroActual
      );

  }


  /* =========================================================
     CONTADORES
     ========================================================= */

  get totalPendientes():
    number {

    return this.reservas
      .filter(
        reserva =>
          reserva.estado ===
          'pendiente'
      )
      .length;

  }


  get totalConfirmadas():
    number {

    return this.reservas
      .filter(
        reserva =>
          reserva.estado ===
          'confirmada'
      )
      .length;

  }


  get totalCanceladas():
    number {

    return this.reservas
      .filter(
        reserva =>
          reserva.estado ===
          'cancelada'
      )
      .length;

  }


  /* =========================================================
     CARGAR
     ========================================================= */

  async cargarReservas():
    Promise<void> {

    this.cargando =
      true;


    this.errorCarga =
      false;


    this.mensajeError =
      '';


    try {

      this.reservas =
        await this.adminService
          .obtenerReservas();

    }
    catch (error) {

      console.error(
        'No fue posible cargar reservas:',
        error
      );


      this.reservas =
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
     FILTRO
     ========================================================= */

  cambiarFiltro(
    filtro:
      FiltroReserva
  ): void {

    this.filtroActual =
      filtro;

  }


  /* =========================================================
     ESTADO
     ========================================================= */

  async cambiarEstado(
    reserva:
      ReservaAdmin,

    nuevoEstado:
      EstadoReserva
  ): Promise<void> {

    if (
      reserva.estado ===
      nuevoEstado
    ) {

      return;

    }


    this.reservaActualizandoId =
      reserva.id;


    this.mensajeError =
      '';


    try {

      await this.adminService
        .actualizarEstadoReserva(
          reserva.id,
          nuevoEstado
        );


      reserva.estado =
        nuevoEstado;

    }
    catch (error) {

      console.error(
        'No fue posible cambiar el estado:',
        error
      );


      this.mensajeError =
        'No fue posible actualizar la reserva.';

    }
    finally {

      this.reservaActualizandoId =
        null;

    }

  }


  /* =========================================================
     FECHAS
     ========================================================= */

  formatearFechaEvento(
    fecha:
      string | undefined
  ): string {

    if (!fecha) {

      return 'Fecha no disponible';

    }


    return new Intl.DateTimeFormat(
      'es-MX',
      {

        weekday:
          'short',

        day:
          'numeric',

        month:
          'short',

        year:
          'numeric',

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


  formatearFechaSolicitud(
    fecha:
      string
  ): string {

    return new Intl.DateTimeFormat(
      'es-MX',
      {

        day:
          'numeric',

        month:
          'short',

        year:
          'numeric',

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


  /* =========================================================
     MONTO
     ========================================================= */

  formatearMonto(
    reserva:
      ReservaAdmin
  ): string {

    if (
      reserva.monto_total ===
      null
    ) {

      return 'Sin pago registrado';

    }


    return new Intl.NumberFormat(
      'es-MX',
      {

        style:
          'currency',

        currency:
          reserva.moneda
          || 'MXN',

        minimumFractionDigits:
          0,

        maximumFractionDigits:
          2

      }
    )
      .format(
        reserva.monto_total
      );

  }

}