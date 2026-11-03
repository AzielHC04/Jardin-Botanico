import {
  Injectable
} from '@angular/core';

import {
  SupabaseService
} from './supabase.service';


export type EstadoReserva =
  | 'pendiente'
  | 'confirmada'
  | 'cancelada';


export interface EventoReservaAdmin {

  id: string;

  titulo: string;

  fecha_inicio: string;

  fecha_fin: string | null;

  imagen_url: string | null;

}


export interface ReservaAdmin {

  id: string;

  evento_id: string;

  nombre: string;

  email: string;

  telefono: string;

  cantidad_personas: number;

  mensaje: string | null;

  estado: EstadoReserva;

  precio_unitario: number | null;

  monto_total: number | null;

  moneda: string;

  created_at: string;

  updated_at: string;

  evento: EventoReservaAdmin | null;

}


@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     OBTENER RESERVAS
     ========================================================= */

  async obtenerReservas():
    Promise<ReservaAdmin[]> {

    const {
      data: reservasData,
      error: reservasError
    } = await this.supabaseService
      .client
      .schema('public')
      .from('reservas')
      .select(`
        id,
        evento_id,
        nombre,
        email,
        telefono,
        cantidad_personas,
        mensaje,
        estado,
        precio_unitario,
        monto_total,
        moneda,
        created_at,
        updated_at
      `)
      .order(
        'created_at',
        {
          ascending: false
        }
      );


    if (reservasError) {

      console.error(
        'Error al obtener reservas:',
        reservasError
      );

      throw reservasError;

    }


    /*
     * Normalizamos los datos para evitar
     * problemas de tipado con Supabase.
     */

    const reservasBase = (
      reservasData ?? []
    ).map(
      reserva => {

        let estado:
          EstadoReserva =
            'pendiente';


        if (
          reserva.estado ===
          'confirmada'
        ) {

          estado =
            'confirmada';

        }
        else if (
          reserva.estado ===
          'cancelada'
        ) {

          estado =
            'cancelada';

        }


        return {

          id:
            String(
              reserva.id
            ),

          evento_id:
            String(
              reserva.evento_id
            ),

          nombre:
            String(
              reserva.nombre ?? ''
            ),

          email:
            String(
              reserva.email ?? ''
            ),

          telefono:
            String(
              reserva.telefono ?? ''
            ),

          cantidad_personas:
            Number(
              reserva.cantidad_personas
            ),

          mensaje:
            reserva.mensaje
            ?? null,

          estado,

          precio_unitario:
            reserva.precio_unitario ===
            null
              ? null
              : Number(
                  reserva.precio_unitario
                ),

          monto_total:
            reserva.monto_total ===
            null
              ? null
              : Number(
                  reserva.monto_total
                ),

          moneda:
            String(
              reserva.moneda
              ?? 'MXN'
            ),

          created_at:
            String(
              reserva.created_at
            ),

          updated_at:
            String(
              reserva.updated_at
            )

        };

      }
    );


    if (
      reservasBase.length === 0
    ) {

      return [];

    }


    /* =======================================================
       EVENTOS RELACIONADOS
       ======================================================= */

    const eventosIds =
      [
        ...new Set(
          reservasBase.map(
            reserva =>
              reserva.evento_id
          )
        )
      ];


    const {
      data: eventosData,
      error: eventosError
    } = await this.supabaseService
      .client
      .schema('public')
      .from('eventos')
      .select(`
        id,
        titulo,
        fecha_inicio,
        fecha_fin,
        imagen_url
      `)
      .in(
        'id',
        eventosIds
      );


    if (eventosError) {

      console.error(
        'Error al obtener eventos asociados:',
        eventosError
      );

      throw eventosError;

    }


    const eventos =
      (
        eventosData ?? []
      ).map(
        evento => ({

          id:
            String(
              evento.id
            ),

          titulo:
            String(
              evento.titulo
              ?? 'Evento'
            ),

          fecha_inicio:
            String(
              evento.fecha_inicio
            ),

          fecha_fin:
            evento.fecha_fin
            ?? null,

          imagen_url:
            evento.imagen_url
            ?? null

        })
      );


    const eventosMapa =
      new Map<
        string,
        EventoReservaAdmin
      >();


    eventos.forEach(
      evento => {

        eventosMapa.set(
          evento.id,
          evento
        );

      }
    );


    /* =======================================================
       RESULTADO FINAL
       ======================================================= */

    return reservasBase.map(
      reserva => ({

        ...reserva,

        evento:
          eventosMapa.get(
            reserva.evento_id
          )
          ?? null

      })
    );

  }


  /* =========================================================
     ACTUALIZAR ESTADO
     ========================================================= */

  async actualizarEstadoReserva(
    reservaId: string,
    estado: EstadoReserva
  ): Promise<void> {

    const {
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('reservas')
      .update({

        estado

      })
      .eq(
        'id',
        reservaId
      );


    if (error) {

      console.error(
        'Error al actualizar reserva:',
        error
      );

      throw error;

    }

  }

}