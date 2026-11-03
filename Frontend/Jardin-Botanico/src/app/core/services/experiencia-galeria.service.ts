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
export class ExperienciaGaleriaService {


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  async obtenerGaleriaActiva(
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
        'Error al obtener galería pública:',
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

        experiencia_id:
          String(
            fila.experiencia_id
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

  }

}