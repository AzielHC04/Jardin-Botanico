import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  SupabaseService
} from '../../core/services/supabase.service';

import {
  Experiencia
} from '../../core/models/experiencia.model';


interface ExperienciaVista {

  id: string;

  titulo: string;

  subtitulo: string;

  descripcion: string;

  imagen: string;

  categoria: string;

  etiqueta: string;

  ruta?: string;

}


@Component({
  selector: 'app-experiencias',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './experiencias.component.html',

  styleUrl:
    './experiencias.component.css'
})
export class ExperienciasComponent
implements OnInit {


  experiencias:
    ExperienciaVista[] = [];


  cargando:
    boolean = true;


  errorCarga:
    boolean = false;


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  async ngOnInit():
    Promise<void> {

    await this.cargarExperiencias();

  }


  private async cargarExperiencias():
    Promise<void> {

    this.cargando = true;

    this.errorCarga = false;


    try {

      const experienciasSupabase:
        Experiencia[] =
          await this.supabaseService
            .obtenerExperienciasActivas();


      this.experiencias =
        experienciasSupabase.map(
          experiencia =>
            this.convertirExperiencia(
              experiencia
            )
        );

    }
    catch (error) {

      console.error(
        'No fue posible cargar las experiencias:',
        error
      );


      this.experiencias = [];

      this.errorCarga = true;

    }
    finally {

      this.cargando = false;

    }

  }


  private convertirExperiencia(
    experiencia:
      Experiencia
  ): ExperienciaVista {

    return {

      id:
        experiencia.id,

      titulo:
        experiencia.titulo,

      subtitulo:
        experiencia.subtitulo ?? '',

      descripcion:
        experiencia.descripcion,

      imagen:
        experiencia.imagen_url
        ?? 'assets/J.jpg',

      categoria:
        experiencia.categoria ?? '',

      etiqueta:
        experiencia.etiqueta ?? '',

      ruta:
        experiencia.ruta_destino
        ?? undefined

    };

  }

}