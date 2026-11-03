import {
  Injectable
} from '@angular/core';

import {
  SupabaseService
} from './supabase.service';

import {
  EventoImagen
} from '../models/evento-imagen.model';


export interface EventoGaleriaAdminResumen {

  id: string;

  titulo: string;

  fecha_inicio: string;

  imagen_url: string | null;

  tipo:
    'regular'
    | 'especial';

  activo: boolean;

}


@Injectable({
  providedIn: 'root'
})
export class AdminEventoGaleriaService {


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     EVENTOS
     ========================================================= */

  async obtenerEventos():
    Promise<EventoGaleriaAdminResumen[]> {

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
        fecha_inicio,
        imagen_url,
        tipo,
        activo
      `)
      .order(
        'fecha_inicio',
        {
          ascending: false
        }
      );


    if (error) {

      console.error(
        'Error al obtener eventos:',
        error
      );

      throw error;

    }


    return (
      data ?? []
    ).map(
      fila => ({

        id:
          String(
            fila.id
          ),

        titulo:
          String(
            fila.titulo
            ?? ''
          ),

        fecha_inicio:
          String(
            fila.fecha_inicio
          ),

        imagen_url:
          fila.imagen_url
          ?? null,

        tipo:
          this.normalizarTipo(
            fila.tipo
          ),

        activo:
          Boolean(
            fila.activo
          )

      })
    );

  }


  async obtenerEvento(
    id:
      string
  ): Promise<EventoGaleriaAdminResumen | null> {

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
        fecha_inicio,
        imagen_url,
        tipo,
        activo
      `)
      .eq(
        'id',
        id
      )
      .maybeSingle();


    if (error) {

      console.error(
        'Error al obtener evento:',
        error
      );

      throw error;

    }


    if (!data) {

      return null;

    }


    return {

      id:
        String(
          data.id
        ),

      titulo:
        String(
          data.titulo
          ?? ''
        ),

      fecha_inicio:
        String(
          data.fecha_inicio
        ),

      imagen_url:
        data.imagen_url
        ?? null,

      tipo:
        this.normalizarTipo(
          data.tipo
        ),

      activo:
        Boolean(
          data.activo
        )

    };

  }


  /* =========================================================
     GALERÍA
     ========================================================= */

  async obtenerGaleria(
    eventoId:
      string
  ): Promise<EventoImagen[]> {

    const {
      data,
      error
    } = await this.supabaseService
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
      .order(
        'orden',
        {
          ascending: true
        }
      );


    if (error) {

      console.error(
        'Error al obtener galería:',
        error
      );

      throw error;

    }


    return (
      data ?? []
    ).map(
      fila =>
        this.normalizarImagen(
          fila
        )
    );

  }


  /* =========================================================
     CREAR IMAGEN
     ========================================================= */

  async crearImagen(
    eventoId:
      string,

    imagenUrl:
      string,

    orden:
      number
  ): Promise<EventoImagen> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('evento_imagenes')
      .insert({

        evento_id:
          eventoId,

        imagen_url:
          imagenUrl,

        descripcion:
          null,

        orden,

        activa:
          true

      })
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
      .single();


    if (error) {

      console.error(
        'Error al crear imagen:',
        error
      );

      throw error;

    }


    return this.normalizarImagen(
      data
    );

  }


  /* =========================================================
     ACTUALIZAR IMAGEN
     ========================================================= */

  async actualizarImagen(
    id:
      string,

    descripcion:
      string | null,

    orden:
      number
  ): Promise<void> {

    const {
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('evento_imagenes')
      .update({

        descripcion,

        orden

      })
      .eq(
        'id',
        id
      );


    if (error) {

      console.error(
        'Error al actualizar imagen:',
        error
      );

      throw error;

    }

  }


  /* =========================================================
     ACTIVAR / DESACTIVAR
     ========================================================= */

  async cambiarEstado(
    id:
      string,

    activa:
      boolean
  ): Promise<void> {

    const {
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('evento_imagenes')
      .update({
        activa
      })
      .eq(
        'id',
        id
      );


    if (error) {

      console.error(
        'Error al cambiar estado de imagen:',
        error
      );

      throw error;

    }

  }


  /* =========================================================
     ELIMINAR
     ========================================================= */

  async eliminarImagen(
    imagen:
      EventoImagen
  ): Promise<void> {

    const {
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('evento_imagenes')
      .delete()
      .eq(
        'id',
        imagen.id
      );


    if (error) {

      console.error(
        'Error al eliminar imagen:',
        error
      );

      throw error;

    }


    /*
     * Intentamos limpiar también el archivo
     * del bucket de Storage.
     */

    try {

      const marcador =
        '/contenido-publico/';


      const posicion =
        imagen.imagen_url
          .indexOf(
            marcador
          );


      if (
        posicion < 0
      ) {

        return;

      }


      const ruta =
        decodeURIComponent(
          imagen.imagen_url
            .substring(
              posicion
              + marcador.length
            )
        );


      const {
        error:
          storageError
      } = await this.supabaseService
        .client
        .storage
        .from(
          'contenido-publico'
        )
        .remove([
          ruta
        ]);


      if (storageError) {

        console.warn(
          'El registro se eliminó, pero no fue posible borrar el archivo de Storage:',
          storageError
        );

      }

    }
    catch (storageError) {

      console.warn(
        'El registro se eliminó, pero ocurrió un problema limpiando Storage:',
        storageError
      );

    }

  }


  /* =========================================================
     SUBIR IMAGEN
     ========================================================= */

  async subirImagen(
    archivo:
      File
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


    const limite =
      5
      * 1024
      * 1024;


    if (
      archivo.size
      > limite
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
      || 'webp';


    const identificador =
      Math.random()
        .toString(36)
        .slice(
          2,
          9
        );


    const ruta =
      `eventos/galeria/`
      + `${Date.now()}-`
      + `${identificador}.`
      + `${extension}`;


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
     NORMALIZAR TIPO
     ========================================================= */

  private normalizarTipo(
    valor:
      unknown
  ):
    'regular'
    | 'especial' {

    if (
      valor ===
      'especial'
    ) {

      return 'especial';

    }


    return 'regular';

  }


  /* =========================================================
     NORMALIZAR IMAGEN
     ========================================================= */

  private normalizarImagen(
    fila:
      any
  ): EventoImagen {

    return {

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
          ?? ''
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

    };

  }

}