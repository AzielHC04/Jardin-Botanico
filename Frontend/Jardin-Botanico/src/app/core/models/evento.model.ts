export interface Evento {

  id: string;

  titulo: string;

  subtitulo: string | null;

  descripcion: string;

  fecha_inicio: string;

  fecha_fin: string | null;

  precio: number | null;

  moneda: string;

  precio_texto: string | null;

  cupo_total: number | null;

  imagen_url: string | null;

  tipo:
    | 'regular'
    | 'especial';

  etiqueta: string | null;

  destacado: boolean;

  activo: boolean;

  requiere_pago: boolean;

  created_at: string;

  updated_at: string;

}