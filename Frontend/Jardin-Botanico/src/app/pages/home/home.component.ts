import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

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

import {
  EventoCardComponent
} from '../../shared/evento-card/evento-card.component';


interface ExperienciaHome {

  id: string;

  titulo: string;

  descripcion: string;

  imagen: string;

  ruta: string;

}


interface EventoHome {

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


  banners:
    Banner[] = [];


  bannerIndex:
    number = 0;


  experienciasDestacadas:
    ExperienciaHome[] = [];


  eventosDestacados:
    EventoHome[] = [];


  cargandoEventos:
    boolean = true;


  private bannerInterval?:
    ReturnType<typeof setInterval>;


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  async ngOnInit():
    Promise<void> {

    await Promise.all([

      this.cargarBanners(),

      this.cargarExperiencias(),

      this.cargarEventos()

    ]);

  }


  ngOnDestroy():
    void {

    if (
      this.bannerInterval
    ) {

      clearInterval(
        this.bannerInterval
      );

    }

  }


  /* =========================================================
     BANNER ACTUAL
     ========================================================= */

  get bannerActual():
    Banner | null {

    if (
      this.banners.length === 0
    ) {

      return null;

    }


    return this.banners[
      this.bannerIndex
    ];

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


      if (
        this.banners.length > 1
      ) {

        this.iniciarBannerAutomatico();

      }

    }
    catch (error) {

      console.error(
        'No fue posible cargar banners:',
        error
      );


      this.banners =
        [];

    }

  }


  private iniciarBannerAutomatico():
    void {

    if (
      this.bannerInterval
    ) {

      clearInterval(
        this.bannerInterval
      );

    }


    this.bannerInterval =
      setInterval(
        () => {

          if (
            this.banners.length === 0
          ) {

            return;

          }


          this.bannerIndex =
            (
              this.bannerIndex
              + 1
            )
            %
            this.banners.length;

        },
        5000
      );

  }


  /* =========================================================
     EXPERIENCIAS
     ========================================================= */

  private async cargarExperiencias():
    Promise<void> {

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
              || 'assets/J.jpg',

            /*
             * IMPORTANTE:
             *
             * ruta_destino deja de controlar
             * el botón principal.
             */

            ruta:
              `/experiencia/${experiencia.id}`

          })
        );

    }
    catch (error) {

      console.error(
        'No fue posible cargar experiencias destacadas:',
        error
      );


      this.experienciasDestacadas =
        [];

    }

  }


  /* =========================================================
     EVENTOS
     ========================================================= */

  private async cargarEventos():
    Promise<void> {

    this.cargandoEventos =
      true;


    try {

      const eventos:
        Evento[] =
          await this.supabaseService
            .obtenerEventosDestacados(
              3
            );


      this.eventosDestacados =
        eventos.map(
          evento => ({

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
              || 'assets/J.jpg'

          })
        );

    }
    catch (error) {

      console.error(
        'No fue posible cargar eventos destacados:',
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


  private formatearHorario(
    inicio:
      string,

    fin:
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


    const inicioTexto =
      formatter.format(
        new Date(
          inicio
        )
      );


    if (!fin) {

      return inicioTexto;

    }


    return (
      `${inicioTexto} - `
      +
      formatter.format(
        new Date(
          fin
        )
      )
    );

  }


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
      evento.precio ===
      null
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

}