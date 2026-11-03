import {
  Injectable
} from '@angular/core';

import {
  SupabaseService
} from './supabase.service';

import {
  ConfiguracionSitio
} from '../models/configuracion-sitio.model';

import {
  Banner
} from '../models/banner.model';


export interface ConfiguracionSitioPayload {

  nombre: string;

  subtitulo: string | null;

  descripcion: string | null;

  direccion: string;

  referencia: string | null;

  telefono: string | null;

  whatsapp: string | null;

  email: string | null;

  horarios_atencion: string | null;

  google_maps_url: string | null;

  mapa_embed_url: string | null;

}


export interface BannerAdminPayload {

  titulo: string | null;

  descripcion: string | null;

  imagen_url: string;

  texto_boton: string | null;

  ruta_boton: string | null;

  orden: number;

  activo: boolean;

}


@Injectable({
  providedIn: 'root'
})
export class AdminContenidoService {


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     CONFIGURACIÓN
     ========================================================= */

  async obtenerConfiguracion():
    Promise<ConfiguracionSitio> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('configuracion_sitio')
      .select(`
        id,
        nombre,
        subtitulo,
        descripcion,
        direccion,
        referencia,
        telefono,
        whatsapp,
        email,
        horarios_atencion,
        google_maps_url,
        mapa_embed_url,
        created_at,
        updated_at
      `)
      .eq(
        'id',
        1
      )
      .single();


    if (error) {

      console.error(
        'Error al obtener configuración:',
        error
      );

      throw error;

    }


    return {

      id:
        Number(
          data.id
        ),

      nombre:
        String(
          data.nombre
          ?? ''
        ),

      subtitulo:
        data.subtitulo
        ?? null,

      descripcion:
        data.descripcion
        ?? null,

      direccion:
        String(
          data.direccion
          ?? ''
        ),

      referencia:
        data.referencia
        ?? null,

      telefono:
        data.telefono
        ?? null,

      whatsapp:
        data.whatsapp
        ?? null,

      email:
        data.email
        ?? null,

      horarios_atencion:
        data.horarios_atencion
        ?? null,

      google_maps_url:
        data.google_maps_url
        ?? null,

      mapa_embed_url:
        data.mapa_embed_url
        ?? null,

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


  async actualizarConfiguracion(
    configuracion:
      ConfiguracionSitioPayload
  ): Promise<void> {

    const {
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('configuracion_sitio')
      .update({

        nombre:
          configuracion.nombre,

        subtitulo:
          configuracion.subtitulo,

        descripcion:
          configuracion.descripcion,

        direccion:
          configuracion.direccion,

        referencia:
          configuracion.referencia,

        telefono:
          configuracion.telefono,

        whatsapp:
          configuracion.whatsapp,

        email:
          configuracion.email,

        horarios_atencion:
          configuracion.horarios_atencion,

        google_maps_url:
          configuracion.google_maps_url,

        mapa_embed_url:
          configuracion.mapa_embed_url

      })
      .eq(
        'id',
        1
      );


    if (error) {

      console.error(
        'Error al actualizar configuración:',
        error
      );

      throw error;

    }

  }


  /* =========================================================
     BANNERS
     ========================================================= */

  async obtenerBanners():
    Promise<Banner[]> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('banners')
      .select(`
        id,
        titulo,
        descripcion,
        imagen_url,
        texto_boton,
        ruta_boton,
        orden,
        activo,
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
        'Error al obtener banners:',
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
          fila.titulo
          ?? null,

        descripcion:
          fila.descripcion
          ?? null,

        imagen_url:
          String(
            fila.imagen_url
            ?? ''
          ),

        texto_boton:
          fila.texto_boton
          ?? null,

        ruta_boton:
          fila.ruta_boton
          ?? null,

        orden:
          Number(
            fila.orden
            ?? 0
          ),

        activo:
          Boolean(
            fila.activo
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


  async crearBanner(
    banner:
      BannerAdminPayload
  ): Promise<void> {

    const {
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('banners')
      .insert({

        titulo:
          banner.titulo,

        descripcion:
          banner.descripcion,

        imagen_url:
          banner.imagen_url,

        texto_boton:
          banner.texto_boton,

        ruta_boton:
          banner.ruta_boton,

        orden:
          banner.orden,

        activo:
          banner.activo

      });


    if (error) {

      console.error(
        'Error al crear banner:',
        error
      );

      throw error;

    }

  }


  async actualizarBanner(
    id: string,
    banner: BannerAdminPayload
  ): Promise<void> {

    const {
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('banners')
      .update({

        titulo:
          banner.titulo,

        descripcion:
          banner.descripcion,

        imagen_url:
          banner.imagen_url,

        texto_boton:
          banner.texto_boton,

        ruta_boton:
          banner.ruta_boton,

        orden:
          banner.orden,

        activo:
          banner.activo

      })
      .eq(
        'id',
        id
      );


    if (error) {

      console.error(
        'Error al actualizar banner:',
        error
      );

      throw error;

    }

  }


  async cambiarEstadoBanner(
    id: string,
    activo: boolean
  ): Promise<void> {

    const {
      error
    } = await this.supabaseService
      .client
      .schema('public')
      .from('banners')
      .update({
        activo
      })
      .eq(
        'id',
        id
      );


    if (error) {

      console.error(
        'Error al cambiar estado del banner:',
        error
      );

      throw error;

    }

  }


  /* =========================================================
     STORAGE
     ========================================================= */

  async subirImagenBanner(
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
      `banners/${Date.now()}-`
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
        'Error al subir banner:',
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

}