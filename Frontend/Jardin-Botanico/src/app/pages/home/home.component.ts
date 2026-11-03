import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SupabaseService } from '../../core/services/supabase.service';

import {
  Banner
} from '../../core/models/banner.model';

import {
  Evento
} from '../../core/models/evento.model';


interface ExperienciaDestacada {

  id: number;

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
    RouterLink
  ],

  templateUrl: './home.component.html',

  styleUrl: './home.component.css'
})
export class HomeComponent
implements OnInit, OnDestroy {


  /* =========================================================
     HERO / BANNERS
     ========================================================= */

  banners: Banner[] = [];


  currentBannerIndex: number = 0;


  private bannerInterval?:
    ReturnType<typeof setInterval>;


  private readonly bannerDelay:
    number = 5000;


  get bannerActual(): Banner | null {

    if (this.banners.length === 0) {

      return null;

    }


    return this.banners[
      this.currentBannerIndex
    ];

  }


  /* =========================================================
     EXPERIENCIAS

     TODAVÍA LOCALES.
     Se migrarán después a Supabase.
     ========================================================= */

  experienciasDestacadas:
    ExperienciaDestacada[] = [

    {

      id: 1,

      titulo:
        'Recorridos por el Jardín',

      descripcion:
        'Descubre la riqueza natural del Jardín Botánico de Teya mediante recorridos y experiencias de interpretación.',

      imagen:
        'assets/J.jpg',

      ruta:
        '/jardin'

    },

    {

      id: 2,

      titulo:
        'Gastronomía Yucateca',

      descripcion:
        'Conoce los sabores tradicionales de Yucatán y la propuesta gastronómica que forma parte de la experiencia Teya.',

      imagen:
        'assets/b.jpg',

      ruta:
        '/gastronomia'

    },

    {

      id: 3,

      titulo:
        'Experiencias Especiales',

      descripcion:
        'Actividades culturales, naturales y experiencias diseñadas para disfrutar Teya de una manera diferente.',

      imagen:
        'assets/imagenes/jazz.jpg',

      ruta:
        '/experiencias'

    }

  ];


  /* =========================================================
     EVENTOS DESTACADOS

     Ahora vienen desde Supabase.
     ========================================================= */

  eventosDestacados:
    EventoDestacado[] = [];


  /* =========================================================
     ESTADOS
     ========================================================= */

  cargandoEventos:
    boolean = true;


  /* =========================================================
     CONSTRUCTOR
     ========================================================= */

  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     CICLO DE VIDA
     ========================================================= */

  async ngOnInit(): Promise<void> {


    /*
     * Ejecutamos ambas consultas
     * al mismo tiempo.
     */

    await Promise.all([

      this.cargarBanners(),

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
       * FALLBACK LOCAL
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
     EVENTOS
     ========================================================= */

  private async cargarEventosDestacados():
    Promise<void> {

    this.cargandoEventos = true;


    try {

      const eventos:
        Evento[] =
          await this.supabaseService
            .obtenerEventosDestacados(3);


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


      /*
       * No utilizamos los eventos ficticios
       * como fallback.
       *
       * Si Supabase falla, simplemente
       * no mostraremos eventos falsos.
       */

      this.eventosDestacados = [];

    }
    finally {

      this.cargandoEventos = false;

    }

  }


  /* =========================================================
     CONVERSIÓN EVENTO → TARJETA HOME
     ========================================================= */

  private convertirEventoParaHome(
    evento: Evento
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
     FORMATEAR HORARIO
     ========================================================= */

  private formatearHorario(
    fechaInicio: string,
    fechaFin: string | null
  ): string {

    const inicio =
      new Date(fechaInicio);


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
      formatter.format(inicio);


    if (!fechaFin) {

      return inicioTexto;

    }


    const fin =
      new Date(fechaFin);


    return (
      `${inicioTexto} - ${formatter.format(fin)}`
    );

  }


  /* =========================================================
     FORMATEAR PRECIO
     ========================================================= */

  private formatearPrecio(
    evento: Evento
  ): string {


    /*
     * Si la empresa escribe un texto específico,
     * tiene prioridad.
     *
     * Ejemplo:
     * "Entrada libre"
     * "Consultar precio"
     */

    if (evento.precio_texto) {

      return evento.precio_texto;

    }


    if (
      evento.precio === null
    ) {

      return 'Consultar';

    }


    const precio =
      new Intl.NumberFormat(
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


    return precio;

  }


  /* =========================================================
     CARRUSEL DEL HERO
     ========================================================= */

  private iniciarCarrusel(): void {

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


  private detenerCarrusel(): void {

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