import {
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  NavigationEnd,
  Router
} from '@angular/router';

import {
  Subscription
} from 'rxjs';

import {
  EventoImagen
} from '../../core/models/evento-imagen.model';

import {
  EventoGaleriaService
} from '../../core/services/evento-galeria.service';


@Component({
  selector:
    'app-evento-galeria-publica',

  standalone:
    true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './evento-galeria-publica.component.html',

  styleUrl:
    './evento-galeria-publica.component.css'
})
export class EventoGaleriaPublicaComponent
implements OnInit, OnDestroy {


  eventoId:
    string | null = null;


  eventoTitulo:
    string = '';


  galeria:
    EventoImagen[] = [];


  imagenSeleccionadaIndex:
    number = -1;


  cargando:
    boolean = false;


  private routerSubscription?:
    Subscription;


  constructor(

    private router:
      Router,

    private galeriaService:
      EventoGaleriaService

  ) {}


  async ngOnInit():
    Promise<void> {

    await this.procesarRuta(
      this.router.url
    );


    this.routerSubscription =
      this.router
        .events
        .subscribe(
          evento => {

            if (
              evento
              instanceof
              NavigationEnd
            ) {

              void this.procesarRuta(
                evento.urlAfterRedirects
              );

            }

          }
        );

  }


  ngOnDestroy():
    void {

    this.routerSubscription
      ?.unsubscribe();


    document.body.style.overflow =
      '';

  }


  /* =========================================================
     RUTA
     ========================================================= */

  private async procesarRuta(
    url:
      string
  ): Promise<void> {

    const coincidencia =
      url.match(
        /^\/reserva\/([^/?#]+)/
      );


    if (
      !coincidencia
    ) {

      this.eventoId =
        null;


      this.eventoTitulo =
        '';


      this.galeria =
        [];


      this.imagenSeleccionadaIndex =
        -1;


      return;

    }


    const id =
      decodeURIComponent(
        coincidencia[1]
      );


    this.eventoId =
      id;


    await this.cargarGaleria(
      id
    );

  }


  /* =========================================================
     CARGAR
     ========================================================= */

  private async cargarGaleria(
    eventoId:
      string
  ): Promise<void> {

    this.cargando =
      true;


    try {

      const resultado =
        await this.galeriaService
          .obtenerGaleriaPublica(
            eventoId
          );


      if (
        !resultado
      ) {

        this.eventoTitulo =
          '';


        this.galeria =
          [];


        return;

      }


      this.eventoTitulo =
        resultado.titulo;


      this.galeria =
        resultado.imagenes;

    }
    catch (error) {

      console.error(
        'No fue posible cargar la galería del evento:',
        error
      );


      this.eventoTitulo =
        '';


      this.galeria =
        [];

    }
    finally {

      this.cargando =
        false;

    }

  }


  /* =========================================================
     VISOR
     ========================================================= */

  get imagenSeleccionada():
    EventoImagen | null {

    if (
      this.imagenSeleccionadaIndex < 0
      ||
      this.imagenSeleccionadaIndex
      >= this.galeria.length
    ) {

      return null;

    }


    return this.galeria[
      this.imagenSeleccionadaIndex
    ];

  }


  get cantidadImagenesOcultas():
    number {

    return Math.max(
      0,
      this.galeria.length
      - 6
    );

  }


  abrirImagen(
    index:
      number
  ): void {

    if (
      index < 0
      ||
      index >=
        this.galeria.length
    ) {

      return;

    }


    this.imagenSeleccionadaIndex =
      index;


    document.body.style.overflow =
      'hidden';

  }


  cerrarImagen():
    void {

    this.imagenSeleccionadaIndex =
      -1;


    document.body.style.overflow =
      '';

  }


  anterior(
    event?:
      Event
  ): void {

    event?.stopPropagation();


    if (
      this.galeria.length === 0
    ) {

      return;

    }


    this.imagenSeleccionadaIndex =
      (
        this.imagenSeleccionadaIndex
        - 1
        + this.galeria.length
      )
      %
      this.galeria.length;

  }


  siguiente(
    event?:
      Event
  ): void {

    event?.stopPropagation();


    if (
      this.galeria.length === 0
    ) {

      return;

    }


    this.imagenSeleccionadaIndex =
      (
        this.imagenSeleccionadaIndex
        + 1
      )
      %
      this.galeria.length;

  }


  /* =========================================================
     TECLADO
     ========================================================= */

  @HostListener(
    'document:keydown',
    [
      '$event'
    ]
  )
  manejarTeclado(
    event:
      KeyboardEvent
  ): void {

    if (
      !this.imagenSeleccionada
    ) {

      return;

    }


    if (
      event.key ===
      'Escape'
    ) {

      this.cerrarImagen();

      return;

    }


    if (
      event.key ===
      'ArrowLeft'
    ) {

      this.anterior();

      return;

    }


    if (
      event.key ===
      'ArrowRight'
    ) {

      this.siguiente();

    }

  }

}