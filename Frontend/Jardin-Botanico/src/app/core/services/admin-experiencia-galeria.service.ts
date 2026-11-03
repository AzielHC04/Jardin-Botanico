import {
  Injectable
} from '@angular/core';

import {
  SupabaseService
} from './supabase.service';

import {
  ExperienciaImagen
} from '../models/experiencia-imagen.model';


@Injectable({
  providedIn: 'root'
})
export class AdminExperienciaGaleriaService {


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     OBTENER TODA LA GALERÍA

     El administrador puede ver incluso
     fotografías desactivadas.
     ========================================================= */

  async obtenerGaleria(
    experienciaId:
      string
  ): Promise<ExperienciaImagen[]> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('experiencia_imagenes')
      .select(`
        id,
        experiencia_id,
        imagen_url,
        descripcion,
        orden,
        activa,
        created_at,
        updated_at
      `)
      .eq(
        'experiencia_id',
        experienciaId
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
    experienciaId:
      string,

    imagenUrl:
      string,

    orden:
      number
  ): Promise<ExperienciaImagen> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('experiencia_imagenes')
      .insert({

        experiencia_id:
          experienciaId,

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
        experiencia_id,
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
        'Error al crear imagen de galería:',
        error
      );

      throw error;

    }


    return this.normalizarImagen(
      data
    );

  }


  /* =========================================================
     ACTUALIZAR INFORMACIÓN
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
      .from('experiencia_imagenes')
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
      .from('experiencia_imagenes')
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
     ELIMINAR REGISTRO
     ========================================================= */

  async eliminarImagen(
    id:
      string
  ): Promise<void> {

    const {
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('experiencia_imagenes')
      .delete()
      .eq(
        'id',
        id
      );


    if (error) {

      console.error(
        'Error al eliminar imagen:',
        error
      );

      throw error;

    }

  }


  /* =========================================================
     STORAGE
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
      5 * 1024 * 1024;


    if (
      archivo.size > limite
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
      `experiencias/galeria/`
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
        'Error al subir imagen de galería:',
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
     NORMALIZAR
     ========================================================= */

  private normalizarImagen(
    fila:
      any
  ): ExperienciaImagen {

    return {

      id:
        String(
          fila.id
        ),

      experiencia_id:
        String(
          fila.experiencia_id
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