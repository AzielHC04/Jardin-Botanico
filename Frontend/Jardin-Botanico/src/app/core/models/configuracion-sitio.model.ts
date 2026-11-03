export interface ConfiguracionSitio {

  id: number;

  nombre: string;

  subtitulo: string | null;

  descripcion: string | null;

  direccion: string | null;

  referencia: string | null;

  telefono: string | null;

  whatsapp: string | null;

  email: string | null;

  horarios_atencion: string | null;

  google_maps_url: string | null;

  mapa_embed_url: string | null;

  created_at: string;

  updated_at: string;

}