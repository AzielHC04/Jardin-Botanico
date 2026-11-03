import { Injectable } from '@angular/core';

import {
  createClient,
  SupabaseClient
} from '@supabase/supabase-js';

import {
  environment
} from '../../../environments/environment';

import {
  ConfiguracionSitio
} from '../models/configuracion-sitio.model';

import {
  Banner
} from '../models/banner.model';

import {
  Evento
} from '../models/evento.model';

import {
  Experiencia
} from '../models/experiencia.model';


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private readonly supabase:
    SupabaseClient;


  constructor() {

    this.supabase =
      createClient(
        environment.supabaseUrl,
        environment.supabasePublishableKey,
        {
          db: {
            schema: 'public'
          },

          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      );

  }


  /* =========================================================
     CONFIGURACIÓN DEL SITIO
     ========================================================= */

  async obtenerConfiguracionSitio():
    Promise<ConfiguracionSitio> {

    const {
      data,
      error
    } = await this.supabase
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
      .eq('id', 1)
      .single();


    if (error) {

      console.error(
        'Error al obtener la configuración del sitio:',
        error
      );

      throw error;

    }


    return data as ConfiguracionSitio;

  }


  /* =========================================================
     BANNERS
     ========================================================= */

  async obtenerBannersActivos():
    Promise<Banner[]> {

    const {
      data,
      error
    } = await this.supabase
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
      .eq(
        'activo',
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
        'Error al obtener banners:',
        error
      );

      throw error;

    }


    return (data ?? []) as Banner[];

  }


  /* =========================================================
     EVENTOS DESTACADOS DEL HOME
     ========================================================= */

  async obtenerEventosDestacados(
    limite: number = 3
  ): Promise<Evento[]> {

    const ahora =
      new Date()
        .toISOString();


    const {
      data,
      error
    } = await this.supabase
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
      .eq(
        'activo',
        true
      )
      .eq(
        'destacado',
        true
      )
      .eq(
        'tipo',
        'regular'
      )
      .gte(
        'fecha_inicio',
        ahora
      )
      .order(
        'fecha_inicio',
        {
          ascending: true
        }
      )
      .limit(
        limite
      );


    if (error) {

      console.error(
        'Error al obtener eventos destacados:',
        error
      );

      throw error;

    }


    return (data ?? []) as Evento[];

  }


  /* =========================================================
     TODOS LOS EVENTOS ACTIVOS
     ========================================================= */

  async obtenerEventosActivos():
    Promise<Evento[]> {

    const {
      data,
      error
    } = await this.supabase
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
      .eq(
        'activo',
        true
      )
      .order(
        'fecha_inicio',
        {
          ascending: true
        }
      );


    if (error) {

      console.error(
        'Error al obtener eventos:',
        error
      );

      throw error;

    }


    return (data ?? []) as Evento[];

  }


  /* =========================================================
     EVENTO INDIVIDUAL

     Utilizado por:
     /reserva/:id
     ========================================================= */

  async obtenerEventoPorId(
    id: string
  ): Promise<Evento | null> {

    const {
      data,
      error
    } = await this.supabase
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
      .eq(
        'id',
        id
      )
      .eq(
        'activo',
        true
      )
      .maybeSingle();


    if (error) {

      console.error(
        'Error al obtener evento por ID:',
        error
      );

      throw error;

    }


    return data as Evento | null;

  }


  /* =========================================================
     EXPERIENCIAS ACTIVAS
     ========================================================= */

  async obtenerExperienciasActivas():
    Promise<Experiencia[]> {

    const {
      data,
      error
    } = await this.supabase
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
        'Error al obtener experiencias:',
        error
      );

      throw error;

    }


    return (data ?? []) as Experiencia[];

  }


  /* =========================================================
     EXPERIENCIAS DESTACADAS DEL HOME
     ========================================================= */

  async obtenerExperienciasDestacadas(
    limite: number = 3
  ): Promise<Experiencia[]> {

    const {
      data,
      error
    } = await this.supabase
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
        'activa',
        true
      )
      .eq(
        'destacada',
        true
      )
      .order(
        'orden',
        {
          ascending: true
        }
      )
      .limit(
        limite
      );


    if (error) {

      console.error(
        'Error al obtener experiencias destacadas:',
        error
      );

      throw error;

    }


    return (data ?? []) as Experiencia[];

  }


  /* =========================================================
     CLIENTE
     ========================================================= */

  get client():
    SupabaseClient {

    return this.supabase;

  }

}