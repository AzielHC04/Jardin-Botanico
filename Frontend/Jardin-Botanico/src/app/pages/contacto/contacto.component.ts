import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import { SupabaseService } from '../../core/services/supabase.service';

import {
  ConfiguracionSitio
} from '../../core/models/configuracion-sitio.model';


interface InfoJardin {

  nombre: string;

  subtitulo: string;

  descripcion: string;

  direccion: string;

  referencia: string;

  telefono: string;

  whatsapp: string;

  email: string;

  horariosAtencion: string;

  googleMapsUrl: string;

  mapaEmbedUrl: SafeResourceUrl;

}


@Component({
  selector: 'app-contacto',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent implements OnInit {


  infoJardin: InfoJardin | null = null;


  cargando: boolean = true;

  errorCarga: boolean = false;


  constructor(
    private supabaseService: SupabaseService,
    private sanitizer: DomSanitizer
  ) {}


  async ngOnInit(): Promise<void> {

    await this.cargarConfiguracion();

  }


  /* =========================================================
     CARGAR INFORMACIÓN DESDE SUPABASE
     ========================================================= */

  private async cargarConfiguracion(): Promise<void> {

    this.cargando = true;

    this.errorCarga = false;


    try {

      const configuracion:
        ConfiguracionSitio =
          await this.supabaseService
            .obtenerConfiguracionSitio();


      const mapaSeguro =
        this.sanitizer
          .bypassSecurityTrustResourceUrl(
            configuracion.mapa_embed_url
              ?? 'about:blank'
          );


      this.infoJardin = {

        nombre:
          configuracion.nombre,

        subtitulo:
          configuracion.subtitulo ?? '',

        descripcion:
          configuracion.descripcion ?? '',

        direccion:
          configuracion.direccion ?? '',

        referencia:
          configuracion.referencia ?? '',

        telefono:
          configuracion.telefono ?? '',

        whatsapp:
          configuracion.whatsapp ?? '',

        email:
          configuracion.email ?? '',

        horariosAtencion:
          configuracion.horarios_atencion ?? '',

        googleMapsUrl:
          configuracion.google_maps_url ?? '',

        mapaEmbedUrl:
          mapaSeguro

      };

    }
    catch (error) {

      console.error(
        'No se pudo cargar la información del jardín:',
        error
      );

      this.errorCarga = true;

    }
    finally {

      this.cargando = false;

    }

  }


  /* =========================================================
     GOOGLE MAPS
     ========================================================= */

  abrirComoLlegar(): void {

    const url =
      this.infoJardin?.googleMapsUrl;


    if (!url) {

      console.warn(
        'No existe una URL de Google Maps configurada.'
      );

      return;

    }


    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );

  }

}