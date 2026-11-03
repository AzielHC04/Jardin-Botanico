export interface ColeccionBotanica {

  id: string;

  titulo: string;

  descripcion: string;

  imagen_url: string | null;

  etiqueta: string | null;

  orden: number;

  activa: boolean;

  created_at: string;

  updated_at: string;

}