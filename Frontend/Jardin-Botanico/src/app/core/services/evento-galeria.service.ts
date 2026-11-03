import {
  Injectable
} from '@angular/core';

import {
  SupabaseService
} from './supabase.service';

import {
  EventoImagen
} from '../models/evento-imagen.model';


export interface EventoGaleriaPublica {

  id: string;

  titulo: string;

  imagenes:
    EventoImagen[];

}


@Injectable({
  providedIn: 'root'
})
export class EventoGaleriaService {


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  async obtenerGaleriaPublica(
    eventoId:
      string
  ): Promise<EventoGaleriaPublica | null> {

    const [
      eventoResultado,
      imagenesResultado
    ] = await Promise.all([

      this.supabaseService
        .client
        .schema('public')
        .from('eventos')
        .select(`
          id,
          titulo
        `)
        .eq(
          'id',
          eventoId
        )
        .eq(
          'activo',
          true
        )
        .maybeSingle(),


      this.supabaseService
        .client
        .schema('public')
        .from('evento_imagenes')
        .select(`
          id,
          evento_id,
          imagen_url,
          descripcion,
          orden,
          activa,
          created_at,
          updated_at
        `)
        .eq(
          'evento_id',
          eventoId
        )
        .eq(
          'activa',
          true
        )
        .order(
          'orden',
          {
            ascending:
              true
          }
        )

    ]);


    if (
      eventoResultado.error
    ) {

      console.error(
        'Error al obtener evento para galería:',
        eventoResultado.error
      );

      throw eventoResultado.error;

    }


    if (
      imagenesResultado.error
    ) {

      console.error(
        'Error al obtener imágenes del evento:',
        imagenesResultado.error
      );

      throw imagenesResultado.error;

    }


    if (
      !eventoResultado.data
    ) {

      return null;

    }


    const imagenes:
      EventoImagen[] =
        (
          imagenesResultado.data
          ?? []
        )
        .map(
          fila => ({

            id:
              String(
                fila.id
              ),

            evento_id:
              String(
                fila.evento_id
              ),

            imagen_url:
              String(
                fila.imagen_url
              ),

            descripcion:
              fila.descripcion
              ?? null,

            orden:
              Number(
                fila.orden
                ?? 0
              ),

            activa:
              Boolean(
                fila.activa
              ),

            created_at:
              String(
                fila.created_at
              ),

            updated_at:
              String(
                fila.updated_at
              )

          })
        );


    return {

      id:
        String(
          eventoResultado
            .data
            .id
        ),

      titulo:
        String(
          eventoResultado
            .data
            .titulo
        ),

      imagenes

    };

  }

}