export interface Experiencia {

  id: string;

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

  created_at: string;

  updated_at: string;

}