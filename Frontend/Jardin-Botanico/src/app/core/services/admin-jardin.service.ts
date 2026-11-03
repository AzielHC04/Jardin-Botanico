import {
  Injectable
} from '@angular/core';

import {
  SupabaseService
} from './supabase.service';

import {
  ColeccionBotanica
} from '../models/coleccion-botanica.model';


export interface ColeccionBotanicaPayload {

  titulo: string;

  descripcion: string;

  imagen_url: string | null;

  etiqueta: string | null;

  orden: number;

  activa: boolean;

}


@Injectable({
  providedIn: 'root'
})
export class AdminJardinService {


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     OBTENER TODAS
     ========================================================= */

  async obtenerColecciones():
    Promise<ColeccionBotanica[]> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('colecciones_botanicas')
      .select(`
        id,
        titulo,
        descripcion,
        imagen_url,
        etiqueta,
        orden,
        activa,
        created_at,
        updated_at
      `)
      .order(
        'orden',
        {
          ascending: true
        }
      );


    if (error) {

      console.error(
        'Error al obtener colecciones:',
        error
      );

      throw error;

    }


    return (
      data ?? []
    ).map(
      fila =>
        this.normalizar(
          fila
        )
    );

  }


  /* =========================================================
     CREAR
     ========================================================= */

  async crearColeccion(
    coleccion:
      ColeccionBotanicaPayload
  ): Promise<ColeccionBotanica> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('colecciones_botanicas')
      .insert({

        titulo:
          coleccion.titulo,

        descripcion:
          coleccion.descripcion,

        imagen_url:
          coleccion.imagen_url,

        etiqueta:
          coleccion.etiqueta,

        orden:
          coleccion.orden,

        activa:
          coleccion.activa

      })
      .select(`
        id,
        titulo,
        descripcion,
        imagen_url,
        etiqueta,
        orden,
        activa,
        created_at,
        updated_at
      `)
      .single();


    if (error) {

      console.error(
        'Error al crear colección:',
        error
      );

      throw error;

    }


    return this.normalizar(
      data
    );

  }


  /* =========================================================
     ACTUALIZAR
     ========================================================= */

  async actualizarColeccion(
    id: string,

    coleccion:
      ColeccionBotanicaPayload
  ): Promise<ColeccionBotanica> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('colecciones_botanicas')
      .update({

        titulo:
          coleccion.titulo,

        descripcion:
          coleccion.descripcion,

        imagen_url:
          coleccion.imagen_url,

        etiqueta:
          coleccion.etiqueta,

        orden:
          coleccion.orden,

        activa:
          coleccion.activa

      })
      .eq(
        'id',
        id
      )
      .select(`
        id,
        titulo,
        descripcion,
        imagen_url,
        etiqueta,
        orden,
        activa,
        created_at,
        updated_at
      `)
      .single();


    if (error) {

      console.error(
        'Error al actualizar colección:',
        error
      );

      throw error;

    }


    return this.normalizar(
      data
    );

  }


  /* =========================================================
     ACTIVAR / DESACTIVAR
     ========================================================= */

  async cambiarEstado(
    id: string,
    activa: boolean
  ): Promise<void> {

    const {
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('colecciones_botanicas')
      .update({
        activa
      })
      .eq(
        'id',
        id
      );


    if (error) {

      console.error(
        'Error al cambiar estado de colección:',
        error
      );

      throw error;

    }

  }


  /* =========================================================
     IMAGEN
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
      `jardin/${Date.now()}-`
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
        'Error al subir imagen del Jardín:',
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

  private normalizar(
    fila:
      any
  ): ColeccionBotanica {

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

      descripcion:
        String(
          fila.descripcion
          ?? ''
        ),

      imagen_url:
        fila.imagen_url
        ?? null,

      etiqueta:
        fila.etiqueta
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