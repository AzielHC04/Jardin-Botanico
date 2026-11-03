import {
  Injectable
} from '@angular/core';

import {
  SupabaseService
} from './supabase.service';

import {
  Experiencia
} from '../models/experiencia.model';


@Injectable({
  providedIn: 'root'
})
export class ExperienciasPublicasService {


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     OBTENER EXPERIENCIA POR ID
     ========================================================= */

  async obtenerExperienciaPorId(
    id: string
  ): Promise<Experiencia | null> {

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
      .eq(
        'id',
        id
      )
      .eq(
        'activa',
        true
      )
      .maybeSingle();


    if (error) {

      console.error(
        'Error al obtener experiencia:',
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

      subtitulo:
        data.subtitulo
        ?? null,

      descripcion:
        String(
          data.descripcion
          ?? ''
        ),

      imagen_url:
        data.imagen_url
        ?? null,

      categoria:
        data.categoria
        ?? null,

      etiqueta:
        data.etiqueta
        ?? null,

      ruta_destino:
        data.ruta_destino
        ?? null,

      orden:
        Number(
          data.orden
          ?? 0
        ),

      destacada:
        Boolean(
          data.destacada
        ),

      activa:
        Boolean(
          data.activa
        ),

      created_at:
        String(
          data.created_at
        ),

      updated_at:
        String(
          data.updated_at
        )

    };

  }

}