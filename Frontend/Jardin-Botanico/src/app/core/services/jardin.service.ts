import {
  Injectable
} from '@angular/core';

import {
  SupabaseService
} from './supabase.service';

import {
  ColeccionBotanica
} from '../models/coleccion-botanica.model';


@Injectable({
  providedIn: 'root'
})
export class JardinService {


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     COLECCIONES PÚBLICAS
     ========================================================= */

  async obtenerColeccionesActivas():
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
      .eq(
        'activa',
        true
      )
      .order(
        'orden',
        {
          ascending: true
        }
      );


    if (error) {

      console.error(
        'Error al obtener colecciones botánicas:',
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

      })
    );

  }

}