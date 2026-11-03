import {
  Injectable
} from '@angular/core';

import {
  SupabaseService
} from './supabase.service';

import {
  Experiencia
} from '../models/experiencia.model';


export interface ExperienciaAdminPayload {

  titulo: string;

  subtitulo: string | null;

  descripcion: string;

  imagen_url: string | null;

  categoria: string | null;

  etiqueta: string | null;

  ruta_destino: string | null;

  orden: number;

  destacada: boolean;

  activa: boolean;

}


@Injectable({
  providedIn: 'root'
})
export class AdminExperienciasService {


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     OBTENER EXPERIENCIAS
     ========================================================= */

  async obtenerExperiencias():
    Promise<Experiencia[]> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('experiencias')
      .select(`
        id,
        titulo,
        subtitulo,
        descripcion,
        imagen_url,
        categoria,
        etiqueta,
        ruta_destino,
        orden,
        destacada,
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
        'Error al obtener experiencias administrativas:',
        error
      );

      throw error;

    }


    return (
      data ?? []
    ).map(
      fila =>
        this.normalizarExperiencia(
          fila
        )
    );

  }


  /* =========================================================
     CREAR
     ========================================================= */

  async crearExperiencia(
    experiencia:
      ExperienciaAdminPayload
  ): Promise<Experiencia> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('experiencias')
      .insert({

        titulo:
          experiencia.titulo,

        subtitulo:
          experiencia.subtitulo,

        descripcion:
          experiencia.descripcion,

        imagen_url:
          experiencia.imagen_url,

        categoria:
          experiencia.categoria,

        etiqueta:
          experiencia.etiqueta,

        ruta_destino:
          experiencia.ruta_destino,

        orden:
          experiencia.orden,

        destacada:
          experiencia.destacada,

        activa:
          experiencia.activa

      })
      .select(`
        id,
        titulo,
        subtitulo,
        descripcion,
        imagen_url,
        categoria,
        etiqueta,
        ruta_destino,
        orden,
        destacada,
        activa,
        created_at,
        updated_at
      `)
      .single();


    if (error) {

      console.error(
        'Error al crear experiencia:',
        error
      );

      throw error;

    }


    return this.normalizarExperiencia(
      data
    );

  }


  /* =========================================================
     EDITAR
     ========================================================= */

  async actualizarExperiencia(
    id: string,
    experiencia:
      ExperienciaAdminPayload
  ): Promise<Experiencia> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('experiencias')
      .update({

        titulo:
          experiencia.titulo,

        subtitulo:
          experiencia.subtitulo,

        descripcion:
          experiencia.descripcion,

        imagen_url:
          experiencia.imagen_url,

        categoria:
          experiencia.categoria,

        etiqueta:
          experiencia.etiqueta,

        ruta_destino:
          experiencia.ruta_destino,

        orden:
          experiencia.orden,

        destacada:
          experiencia.destacada,

        activa:
          experiencia.activa

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
        imagen_url,
        categoria,
        etiqueta,
        ruta_destino,
        orden,
        destacada,
        activa,
        created_at,
        updated_at
      `)
      .single();


    if (error) {

      console.error(
        'Error al actualizar experiencia:',
        error
      );

      throw error;

    }


    return this.normalizarExperiencia(
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
      .from('experiencias')
      .update({
        activa
      })
      .eq(
        'id',
        id
      );


    if (error) {

      console.error(
        'Error al cambiar estado de experiencia:',
        error
      );

      throw error;

    }

  }


  /* =========================================================
     SUBIR IMAGEN
     ========================================================= */

  async subirImagen(
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
      `experiencias/${Date.now()}-${identificador}.${extension}`;


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
        'Error al subir imagen de experiencia:',
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
     NORMALIZACIÓN
     ========================================================= */

  private normalizarExperiencia(
    fila: any
  ): Experiencia {

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

      imagen_url:
        fila.imagen_url
        ?? null,

      categoria:
        fila.categoria
        ?? null,

      etiqueta:
        fila.etiqueta
        ?? null,

      ruta_destino:
        fila.ruta_destino
        ?? null,

      orden:
        Number(
          fila.orden
          ?? 0
        ),

      destacada:
        Boolean(
          fila.destacada
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