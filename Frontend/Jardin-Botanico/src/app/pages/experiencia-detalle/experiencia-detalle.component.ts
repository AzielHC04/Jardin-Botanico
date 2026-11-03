import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  Experiencia
} from '../../core/models/experiencia.model';

import {
  ExperienciaImagen
} from '../../core/models/experiencia-imagen.model';

import {
  ExperienciasPublicasService
} from '../../core/services/experiencias-publicas.service';

import {
  ExperienciaGaleriaService
} from '../../core/services/experiencia-galeria.service';


@Component({
  selector:
    'app-experiencia-detalle',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './experiencia-detalle.component.html',

  styleUrl:
    './experiencia-detalle.component.css'
})
export class ExperienciaDetalleComponent
implements OnInit {


  /* =========================================================
     EXPERIENCIA
     ========================================================= */

  experiencia:
    Experiencia | null = null;


  galeria:
    ExperienciaImagen[] = [];


  /* =========================================================
     VISOR
     ========================================================= */

  imagenSeleccionadaIndex:
    number = -1;


  /* =========================================================
     ESTADOS
     ========================================================= */

  cargando:
    boolean = true;


  errorCarga:
    boolean = false;


  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private experienciasService:
      ExperienciasPublicasService,

    private galeriaService:
      ExperienciaGaleriaService

  ) {}


  /* =========================================================
     INICIO
     ========================================================= */

  async ngOnInit():
    Promise<void> {

    const id =
      this.route
        .snapshot
        .paramMap
        .get('id');


    if (!id) {

      await this.router
        .navigate([
          '/experiencias'
        ]);

      return;

    }


    await this.cargarExperiencia(
      id
    );

  }


  /* =========================================================
     CARGAR
     ========================================================= */

  private async cargarExperiencia(
    id:
      string
  ): Promise<void> {

    this.cargando =
      true;


    this.errorCarga =
      false;


    try {

      this.experiencia =
        await this.experienciasService
          .obtenerExperienciaPorId(
            id
          );


      if (!this.experiencia) {

        this.errorCarga =
          true;

        return;

      }


      this.galeria =
        await this.galeriaService
          .obtenerGaleriaActiva(
            id
          );

    }
    catch (error) {

      console.error(
        'No fue posible cargar experiencia:',
        error
      );


      this.experiencia =
        null;


      this.galeria =
        [];


      this.errorCarga =
        true;

    }
    finally {

      this.cargando =
        false;

    }

  }


  /* =========================================================
     ETIQUETA
     ========================================================= */

  get etiquetaVisible():
    string {

    if (!this.experiencia) {

      return '';

    }


    return (
      this.experiencia.etiqueta
      ||
      this.experiencia.categoria
      ||
      'Experiencia Teya'
    );

  }


  /* =========================================================
     RUTA RELACIONADA
     ========================================================= */

  get rutaRelacionada():
    string | null {

    if (
      !this.experiencia
      ||
      !this.experiencia.ruta_destino
      ||
      this.experiencia.ruta_destino ===
      '/gastronomia'
    ) {

      return null;

    }


    return this.experiencia
      .ruta_destino;

  }


  get textoRutaRelacionada():
    string {

    switch (
      this.rutaRelacionada
    ) {

      case '/jardin':

        return 'Explorar el Jardín Botánico';


      case '/eventos':

        return 'Ver próximos eventos';


      case '/contacto':

        return 'Contactar con Teya';


      default:

        return 'Explorar sección relacionada';

    }

  }


  /* =========================================================
     VISOR
     ========================================================= */

  get imagenSeleccionada():
    ExperienciaImagen | null {

    if (
      this.imagenSeleccionadaIndex < 0
      ||
      this.imagenSeleccionadaIndex >=
        this.galeria.length
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
      this.galeria.length - 6
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


  imagenAnterior(
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


  imagenSiguiente(
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

      this.imagenAnterior();

      return;

    }


    if (
      event.key ===
      'ArrowRight'
    ) {

      this.imagenSiguiente();

    }

  }

}