import { Injectable } from '@angular/core';
import { Banner } from '../models/banner.model';
import { Evento } from '../models/evento.model';
import { ConfiguracionSitio } from '../models/configuracion-sitio.model';
import {
  createClient,
  SupabaseClient
} from '@supabase/supabase-js';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private readonly supabase: SupabaseClient;


  constructor() {

    this.supabase = createClient(
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


  async obtenerConfiguracionSitio(): Promise<ConfiguracionSitio> {

    const {
      data,
      error
    } = await this. supabase
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


  get client(): SupabaseClient {

    return this.supabase;

  }
  /* =========================================================
   BANNERS
   ========================================================= */

  async obtenerBannersActivos(): Promise<Banner[]> {

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
      .eq('activo', true)
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
   EVENTOS DESTACADOS
   ========================================================= */

  async obtenerEventosDestacados(
    limite: number = 3
  ): Promise<Evento[]> {

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
      .eq('activo', true)
      .eq('destacado', true)
      .eq('tipo', 'regular')
      .order(
        'fecha_inicio',
        {
          ascending: true
        }
      )
      .limit(limite);


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

  async obtenerEventosActivos(): Promise<Evento[]> {

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
      .eq('activo', true)
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

}