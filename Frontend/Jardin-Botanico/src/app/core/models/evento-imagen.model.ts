export interface EventoImagen {

  id: string;

  evento_id: string;

  imagen_url: string;

  descripcion: string | null;

  orden: number;

  activa: boolean;

  created_at: string;

  updated_at: string;

}