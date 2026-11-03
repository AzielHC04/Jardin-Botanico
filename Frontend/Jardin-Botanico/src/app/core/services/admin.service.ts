import {
  Injectable
} from '@angular/core';

import {
  SupabaseService
} from './supabase.service';

import {
  Evento
} from '../models/evento.model';


/* =========================================================
   RESERVAS
   ========================================================= */

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


/* =========================================================
   EVENTOS
   ========================================================= */

export interface EventoAdminPayload {

  titulo: string;

  subtitulo: string | null;

  descripcion: string;

  fecha_inicio: string;

  fecha_fin: string | null;

  precio: number | null;

  moneda: string;

  precio_texto: string | null;

  cupo_total: number | null;

  imagen_url: string | null;

  tipo:
    | 'regular'
    | 'especial';

  etiqueta: string | null;

  destacado: boolean;

  activo: boolean;

  requiere_pago: boolean;

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
     RESERVAS
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


    const reservasBase:
      Array<
        Omit<
          ReservaAdmin,
          'evento'
        >
      > =
      (
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
              reserva.precio_unitario === null
                ? null
                : Number(
                    reserva.precio_unitario
                  ),

            monto_total:
              reserva.monto_total === null
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


    const eventos:
      EventoReservaAdmin[] =
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


  /* =========================================================
     OBTENER TODOS LOS EVENTOS
     ========================================================= */

  async obtenerEventosAdmin():
    Promise<Evento[]> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('eventos')
      .select(`
        id,
        titulo,
        subtitulo,
        descripcion,
        fecha_inicio,
        fecha_fin,
        precio,
        moneda,
        precio_texto,
        cupo_total,
        imagen_url,
        tipo,
        etiqueta,
        destacado,
        activo,
        requiere_pago,
        created_at,
        updated_at
      `)
      .order(
        'fecha_inicio',
        {
          ascending: false
        }
      );


    if (error) {

      console.error(
        'Error al obtener eventos administrativos:',
        error
      );

      throw error;

    }


    return (
      data ?? []
    ).map(
      fila =>
        this.normalizarEvento(
          fila
        )
    );

  }


  /* =========================================================
     CREAR EVENTO
     ========================================================= */

  async crearEvento(
    evento:
      EventoAdminPayload
  ): Promise<Evento> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('eventos')
      .insert({
        titulo:
          evento.titulo,

        subtitulo:
          evento.subtitulo,

        descripcion:
          evento.descripcion,

        fecha_inicio:
          evento.fecha_inicio,

        fecha_fin:
          evento.fecha_fin,

        precio:
          evento.precio,

        moneda:
          evento.moneda,

        precio_texto:
          evento.precio_texto,

        cupo_total:
          evento.cupo_total,

        imagen_url:
          evento.imagen_url,

        tipo:
          evento.tipo,

        etiqueta:
          evento.etiqueta,

        destacado:
          evento.destacado,

        activo:
          evento.activo,

        requiere_pago:
          evento.requiere_pago
      })
      .select(`
        id,
        titulo,
        subtitulo,
        descripcion,
        fecha_inicio,
        fecha_fin,
        precio,
        moneda,
        precio_texto,
        cupo_total,
        imagen_url,
        tipo,
        etiqueta,
        destacado,
        activo,
        requiere_pago,
        created_at,
        updated_at
      `)
      .single();


    if (error) {

      console.error(
        'Error al crear evento:',
        error
      );

      throw error;

    }


    return this.normalizarEvento(
      data
    );

  }


  /* =========================================================
     EDITAR EVENTO
     ========================================================= */

  async actualizarEvento(
    id: string,
    evento: EventoAdminPayload
  ): Promise<Evento> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('eventos')
      .update({
        titulo:
          evento.titulo,

        subtitulo:
          evento.subtitulo,

        descripcion:
          evento.descripcion,

        fecha_inicio:
          evento.fecha_inicio,

        fecha_fin:
          evento.fecha_fin,

        precio:
          evento.precio,

        moneda:
          evento.moneda,

        precio_texto:
          evento.precio_texto,

        cupo_total:
          evento.cupo_total,

        imagen_url:
          evento.imagen_url,

        tipo:
          evento.tipo,

        etiqueta:
          evento.etiqueta,

        destacado:
          evento.destacado,

        activo:
          evento.activo,

        requiere_pago:
          evento.requiere_pago
      })
      .eq(
        'id',
        id
      )
      .select(`
        id,
        titulo,
        subtitulo,
        descripcion,
        fecha_inicio,
        fecha_fin,
        precio,
        moneda,
        precio_texto,
        cupo_total,
        imagen_url,
        tipo,
        etiqueta,
        destacado,
        activo,
        requiere_pago,
        created_at,
        updated_at
      `)
      .single();


    if (error) {

      console.error(
        'Error al actualizar evento:',
        error
      );

      throw error;

    }


    return this.normalizarEvento(
      data
    );

  }


  /* =========================================================
     ACTIVAR / DESACTIVAR
     ========================================================= */

  async actualizarActivoEvento(
    id: string,
    activo: boolean
  ): Promise<void> {

    const {
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('eventos')
      .update({
        activo
      })
      .eq(
        'id',
        id
      );


    if (error) {

      console.error(
        'Error al cambiar estado del evento:',
        error
      );

      throw error;

    }

  }


  /* =========================================================
     SUBIR IMAGEN
     ========================================================= */

  async subirImagenEvento(
    archivo: File
  ): Promise<string> {

    if (
      !archivo.type.startsWith(
        'image/'
      )
    ) {

      throw new Error(
        'El archivo seleccionado no es una imagen.'
      );

    }


    const maximo =
      5
      * 1024
      * 1024;


    if (
      archivo.size > maximo
    ) {

      throw new Error(
        'La imagen supera el límite de 5 MB.'
      );

    }


    const extension =
      archivo.name
        .split('.')
        .pop()
        ?.toLowerCase()
      || 'jpg';


    const identificador =
      Math.random()
        .toString(36)
        .slice(
          2,
          9
        );


    const ruta =
      `eventos/${Date.now()}-${identificador}.${extension}`;


    const {
      error
    } = await this.supabaseService
      .client
      .storage
      .from(
        'contenido-publico'
      )
      .upload(
        ruta,
        archivo,
        {
          cacheControl:
            '3600',

          upsert:
            false,

          contentType:
            archivo.type
        }
      );


    if (error) {

      console.error(
        'Error al subir imagen:',
        error
      );

      throw error;

    }


    const {
      data
    } = this.supabaseService
      .client
      .storage
      .from(
        'contenido-publico'
      )
      .getPublicUrl(
        ruta
      );


    return data.publicUrl;

  }


  /* =========================================================
     NORMALIZADOR
     ========================================================= */

  private normalizarEvento(
    fila: any
  ): Evento {

    return {

      id:
        String(
          fila.id
        ),

      titulo:
        String(
          fila.titulo
          ?? ''
        ),

      subtitulo:
        fila.subtitulo
        ?? null,

      descripcion:
        String(
          fila.descripcion
          ?? ''
        ),

      fecha_inicio:
        String(
          fila.fecha_inicio
        ),

      fecha_fin:
        fila.fecha_fin
        ?? null,

      precio:
        fila.precio === null
          || fila.precio === undefined
            ? null
            : Number(
                fila.precio
              ),

      moneda:
        String(
          fila.moneda
          ?? 'MXN'
        ),

      precio_texto:
        fila.precio_texto
        ?? null,

      cupo_total:
        fila.cupo_total === null
          || fila.cupo_total === undefined
            ? null
            : Number(
                fila.cupo_total
              ),

      imagen_url:
        fila.imagen_url
        ?? null,

      tipo:
        fila.tipo ===
        'especial'
          ? 'especial'
          : 'regular',

      etiqueta:
        fila.etiqueta
        ?? null,

      destacado:
        Boolean(
          fila.destacado
        ),

      activo:
        Boolean(
          fila.activo
        ),

      requiere_pago:
        Boolean(
          fila.requiere_pago
        ),

      created_at:
        String(
          fila.created_at
        ),

      updated_at:
        String(
          fila.updated_at
        )

    };

  }

}