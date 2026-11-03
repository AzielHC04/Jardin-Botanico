import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  EventoCardComponent
} from '../../shared/evento-card/evento-card.component';
import {
  SupabaseService
} from '../../core/services/supabase.service';

import {
  Banner
} from '../../core/models/banner.model';

import {
  Evento
} from '../../core/models/evento.model';

import {
  Experiencia
} from '../../core/models/experiencia.model';


interface ExperienciaDestacada {

  id: string;

  titulo: string;

  descripcion: string;

  imagen: string;

  ruta: string;

}


interface EventoDestacado {

  id: string;

  titulo: string;

  descripcion: string;

  horario: string;

  precio: string;

  imagen: string;

}


@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    EventoCardComponent
  ],

  templateUrl:
    './home.component.html',

  styleUrl:
    './home.component.css'
})
export class HomeComponent
implements OnInit, OnDestroy {


  /* =========================================================
     BANNERS
     ========================================================= */

  banners:
    Banner[] = [];


  currentBannerIndex:
    number = 0;


  private bannerInterval?:
    ReturnType<typeof setInterval>;


  private readonly bannerDelay:
    number = 5000;


  get bannerActual():
    Banner | null {

    if (
      this.banners.length === 0
    ) {

      return null;

    }


    return this.banners[
      this.currentBannerIndex
    ];

  }


  /* =========================================================
     EXPERIENCIAS DESTACADAS
     ========================================================= */

  experienciasDestacadas:
    ExperienciaDestacada[] = [];


  /* =========================================================
     EVENTOS DESTACADOS
     ========================================================= */

  eventosDestacados:
    EventoDestacado[] = [];


  /* =========================================================
     ESTADOS
     ========================================================= */

  cargandoExperiencias:
    boolean = true;


  cargandoEventos:
    boolean = true;


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     CICLO DE VIDA
     ========================================================= */

  async ngOnInit():
    Promise<void> {


    await Promise.all([

      this.cargarBanners(),

      this.cargarExperienciasDestacadas(),

      this.cargarEventosDestacados()

    ]);


    this.iniciarCarrusel();

  }


  ngOnDestroy(): void {

    this.detenerCarrusel();

  }


  /* =========================================================
     BANNERS
     ========================================================= */

  private async cargarBanners():
    Promise<void> {

    try {

      this.banners =
        await this.supabaseService
          .obtenerBannersActivos();


      this.currentBannerIndex = 0;

    }
    catch (error) {

      console.error(
        'No fue posible cargar los banners:',
        error
      );


      /*
       * Solo el Hero conserva fallback,
       * para evitar una portada completamente vacía.
       */

      this.banners = [

        {

          id:
            'fallback',

          titulo:
            'Jardín Botánico de Teya',

          descripcion:
            'Naturaleza, historia y experiencias que conectan con la riqueza cultural y botánica de Yucatán.',

          imagen_url:
            'assets/b.jpg',

          texto_boton:
            'Conocer el jardín',

          ruta_boton:
            '/jardin',

          orden:
            1,

          activo:
            true,

          created_at:
            '',

          updated_at:
            ''

        }

      ];

    }

  }


  /* =========================================================
     EXPERIENCIAS DESTACADAS
     ========================================================= */

  private async cargarExperienciasDestacadas():
    Promise<void> {

    this.cargandoExperiencias = true;


    try {

      const experiencias:
        Experiencia[] =
          await this.supabaseService
            .obtenerExperienciasDestacadas(
              3
            );


      this.experienciasDestacadas =
        experiencias.map(
          experiencia => ({

            id:
              experiencia.id,

            titulo:
              experiencia.titulo,

            descripcion:
              experiencia.descripcion,

            imagen:
              experiencia.imagen_url
              ?? 'assets/J.jpg',

            ruta:
              experiencia.ruta_destino
              ?? '/experiencias'

          })
        );

    }
    catch (error) {

      console.error(
        'No fue posible cargar las experiencias destacadas:',
        error
      );


      this.experienciasDestacadas =
        [];

    }
    finally {

      this.cargandoExperiencias =
        false;

    }

  }


  /* =========================================================
     EVENTOS DESTACADOS
     ========================================================= */

  private async cargarEventosDestacados():
    Promise<void> {

    this.cargandoEventos = true;


    try {

      const eventos:
        Evento[] =
          await this.supabaseService
            .obtenerEventosDestacados(
              3
            );


      this.eventosDestacados =
        eventos.map(
          evento =>
            this.convertirEventoParaHome(
              evento
            )
        );

    }
    catch (error) {

      console.error(
        'No fue posible cargar los eventos destacados:',
        error
      );


      this.eventosDestacados =
        [];

    }
    finally {

      this.cargandoEventos =
        false;

    }

  }


  /* =========================================================
     EVENTO → HOME
     ========================================================= */

  private convertirEventoParaHome(
    evento:
      Evento
  ): EventoDestacado {

    return {

      id:
        evento.id,

      titulo:
        evento.titulo,

      descripcion:
        evento.descripcion,

      horario:
        this.formatearHorario(
          evento.fecha_inicio,
          evento.fecha_fin
        ),

      precio:
        this.formatearPrecio(
          evento
        ),

      imagen:
        evento.imagen_url
        ?? 'assets/J.jpg'

    };

  }


  /* =========================================================
     HORARIO
     ========================================================= */

  private formatearHorario(
    fechaInicio:
      string,

    fechaFin:
      string | null
  ): string {

    const formatter =
      new Intl.DateTimeFormat(
        'es-MX',
        {

          hour:
            '2-digit',

          minute:
            '2-digit',

          hour12:
            true,

          timeZone:
            'America/Merida'

        }
      );


    const inicio =
      formatter.format(
        new Date(
          fechaInicio
        )
      );


    if (!fechaFin) {

      return inicio;

    }


    const fin =
      formatter.format(
        new Date(
          fechaFin
        )
      );


    return `${inicio} - ${fin}`;

  }


  /* =========================================================
     PRECIO
     ========================================================= */

  private formatearPrecio(
    evento:
      Evento
  ): string {


    if (
      evento.precio_texto
    ) {

      return evento.precio_texto;

    }


    if (
      evento.precio === null
    ) {

      return 'Consultar';

    }


    return new Intl.NumberFormat(
      'es-MX',
      {

        style:
          'currency',

        currency:
          evento.moneda,

        minimumFractionDigits:
          0,

        maximumFractionDigits:
          2

      }
    )
      .format(
        evento.precio
      );

  }


  /* =========================================================
     CARRUSEL HERO
     ========================================================= */

  private iniciarCarrusel():
    void {

    this.detenerCarrusel();


    if (
      this.banners.length <= 1
    ) {

      return;

    }


    this.bannerInterval =
      setInterval(
        () => {

          this.currentBannerIndex =
            (
              this.currentBannerIndex + 1
            )
            %
            this.banners.length;

        },
        this.bannerDelay
      );

  }


  private detenerCarrusel():
    void {

    if (
      this.bannerInterval
    ) {

      clearInterval(
        this.bannerInterval
      );


      this.bannerInterval =
        undefined;

    }

  }

}