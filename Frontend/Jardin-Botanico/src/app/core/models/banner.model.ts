export interface Banner {

  id: string;

  titulo: string | null;

  descripcion: string | null;

  imagen_url: string;

  texto_boton: string | null;

  ruta_boton: string | null;

  orden: number;

  activo: boolean;

  created_at: string;

  updated_at: string;

}