import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  EventoImagen
} from '../../core/models/evento-imagen.model';

import {
  AdminEventoGaleriaService,
  EventoGaleriaAdminResumen
} from '../../core/services/admin-evento-galeria.service';


@Component({
  selector:
    'app-admin-evento-galeria',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './admin-evento-galeria.component.html',

  styleUrl:
    './admin-evento-galeria.component.css'
})
export class AdminEventoGaleriaComponent
implements OnInit {


  private readonly imagenAncho:
    number = 1200;


  private readonly imagenAlto:
    number = 720;


  private readonly maxBytes:
    number =
      5 * 1024 * 1024;


  eventos:
    EventoGaleriaAdminResumen[] = [];


  evento:
    EventoGaleriaAdminResumen | null = null;


  galeria:
    EventoImagen[] = [];


  eventoId:
    string | null = null;


  cargando:
    boolean = true;


  subiendo:
    boolean = false;


  imagenActualizandoId:
    string | null = null;


  mensajeError:
    string = '';


  mensajeExito:
    string = '';


  constructor(

    private route:
      ActivatedRoute,

    private galeriaService:
      AdminEventoGaleriaService

  ) {}


  async ngOnInit():
    Promise<void> {

    this.eventoId =
      this.route
        .snapshot
        .paramMap
        .get('id');


    if (
      this.eventoId
    ) {

      await this.cargarEditor(
        this.eventoId
      );

      return;

    }


    await this.cargarEventos();

  }


  /* =========================================================
     LISTADO
     ========================================================= */

  private async cargarEventos():
    Promise<void> {

    this.cargando =
      true;


    try {

      this.eventos =
        await this.galeriaService
          .obtenerEventos();

    }
    catch (error) {

      console.error(
        'No fue posible cargar eventos:',
        error
      );


      this.mensajeError =
        'No fue posible cargar los eventos.';

    }
    finally {

      this.cargando =
        false;

    }

  }


  /* =========================================================
     EDITOR
     ========================================================= */

  private async cargarEditor(
    eventoId:
      string
  ): Promise<void> {

    this.cargando =
      true;


    try {

      const [
        evento,
        galeria
      ] = await Promise.all([

        this.galeriaService
          .obtenerEvento(
            eventoId
          ),

        this.galeriaService
          .obtenerGaleria(
            eventoId
          )

      ]);


      this.evento =
        evento;


      this.galeria =
        galeria;


      if (
        !evento
      ) {

        this.mensajeError =
          'El evento no existe.';

      }

    }
    catch (error) {

      console.error(
        'No fue posible cargar la galería:',
        error
      );


      this.mensajeError =
        'No fue posible cargar la galería.';

    }
    finally {

      this.cargando =
        false;

    }

  }


  /* =========================================================
     FECHA
     ========================================================= */

  formatearFecha(
    fecha:
      string
  ): string {

    return new Intl.DateTimeFormat(
      'es-MX',
      {

        weekday:
          'long',

        day:
          'numeric',

        month:
          'long',

        year:
          'numeric',

        timeZone:
          'America/Merida'

      }
    )
      .format(
        new Date(
          fecha
        )
      );

  }


  /* =========================================================
     SUBIR
     ========================================================= */

  async seleccionarImagen(
    event:
      Event
  ): Promise<void> {

    if (
      !this.eventoId
    ) {

      return;

    }


    const input =
      event.target;


    if (
      !(
        input
        instanceof
        HTMLInputElement
      )
    ) {

      return;

    }


    const archivo =
      input.files
        ?.item(0);


    if (
      !archivo
    ) {

      input.value =
        '';

      return;

    }


    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    if (
      !archivo.type
        .startsWith(
          'image/'
        )
    ) {

      this.mensajeError =
        'El archivo seleccionado no es una imagen.';


      input.value =
        '';

      return;

    }


    if (
      archivo.size
      >
      this.maxBytes
    ) {

      this.mensajeError =
        'La imagen no puede superar los 5 MB.';


      input.value =
        '';

      return;

    }


    this.subiendo =
      true;


    try {

      const procesada =
        await this.prepararImagen(
          archivo
        );


      const url =
        await this.galeriaService
          .subirImagen(
            procesada
          );


      const siguienteOrden =
        this.galeria.length > 0
          ? Math.max(
              ...this.galeria.map(
                imagen =>
                  imagen.orden
              )
            ) + 1
          : 1;


      await this.galeriaService
        .crearImagen(

          this.eventoId,

          url,

          siguienteOrden

        );


      this.galeria =
        await this.galeriaService
          .obtenerGaleria(
            this.eventoId
          );


      this.mensajeExito =
        'Fotografía agregada correctamente.';

    }
    catch (error) {

      console.error(
        'No fue posible subir fotografía:',
        error
      );


      this.mensajeError =
        error
        instanceof Error
          ? error.message
          : 'No fue posible subir la fotografía.';

    }
    finally {

      this.subiendo =
        false;


      input.value =
        '';

    }

  }


  /* =========================================================
     ACTUALIZAR
     ========================================================= */

  async actualizarImagen(
    imagen:
      EventoImagen,

    descripcion:
      string,

    ordenTexto:
      string
  ): Promise<void> {

    this.imagenActualizandoId =
      imagen.id;


    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    try {

      const valorOrden =
        Number(
          ordenTexto
        );


      const orden =
        Number.isFinite(
          valorOrden
        )
          ? Math.max(
              0,
              valorOrden
            )
          : 0;


      await this.galeriaService
        .actualizarImagen(

          imagen.id,

          descripcion
            .trim()
          || null,

          orden

        );


      if (
        this.eventoId
      ) {

        this.galeria =
          await this.galeriaService
            .obtenerGaleria(
              this.eventoId
            );

      }


      this.mensajeExito =
        'Fotografía actualizada.';

    }
    catch (error) {

      console.error(
        'No fue posible actualizar:',
        error
      );


      this.mensajeError =
        'No fue posible actualizar la fotografía.';

    }
    finally {

      this.imagenActualizandoId =
        null;

    }

  }


  /* =========================================================
     ACTIVAR
     ========================================================= */

  async cambiarEstado(
    imagen:
      EventoImagen
  ): Promise<void> {

    this.imagenActualizandoId =
      imagen.id;


    try {

      await this.galeriaService
        .cambiarEstado(

          imagen.id,

          !imagen.activa

        );


      imagen.activa =
        !imagen.activa;

    }
    catch (error) {

      console.error(
        'No fue posible cambiar estado:',
        error
      );


      this.mensajeError =
        'No fue posible cambiar el estado.';

    }
    finally {

      this.imagenActualizandoId =
        null;

    }

  }


  /* =========================================================
     ELIMINAR
     ========================================================= */

  async eliminarImagen(
    imagen:
      EventoImagen
  ): Promise<void> {

    const confirmar =
      window.confirm(
        '¿Deseas eliminar esta fotografía del evento?'
      );


    if (
      !confirmar
    ) {

      return;

    }


    this.imagenActualizandoId =
      imagen.id;


    try {

      await this.galeriaService
        .eliminarImagen(
          imagen
        );


      if (
        this.eventoId
      ) {

        this.galeria =
          await this.galeriaService
            .obtenerGaleria(
              this.eventoId
            );

      }


      this.mensajeExito =
        'Fotografía eliminada.';

    }
    catch (error) {

      console.error(
        'No fue posible eliminar:',
        error
      );


      this.mensajeError =
        'No fue posible eliminar la fotografía.';

    }
    finally {

      this.imagenActualizandoId =
        null;

    }

  }


  /* =========================================================
     PROCESAR 1200 × 720
     ========================================================= */

  private async prepararImagen(
    archivo:
      File
  ): Promise<File> {

    const imagen =
      await this.cargarImagen(
        archivo
      );


    const canvas =
      document.createElement(
        'canvas'
      );


    canvas.width =
      this.imagenAncho;


    canvas.height =
      this.imagenAlto;


    const contexto =
      canvas.getContext(
        '2d'
      );


    if (
      !contexto
    ) {

      throw new Error(
        'El navegador no pudo procesar la imagen.'
      );

    }


    contexto.fillStyle =
      '#0b2b22';


    contexto.fillRect(
      0,
      0,
      this.imagenAncho,
      this.imagenAlto
    );


    const escalaFondo =
      Math.max(

        this.imagenAncho
        / imagen.naturalWidth,

        this.imagenAlto
        / imagen.naturalHeight

      )
      * 1.08;


    const fondoAncho =
      imagen.naturalWidth
      * escalaFondo;


    const fondoAlto =
      imagen.naturalHeight
      * escalaFondo;


    contexto.filter =
      'blur(28px) brightness(0.68)';


    contexto.drawImage(

      imagen,

      (
        this.imagenAncho
        - fondoAncho
      ) / 2,

      (
        this.imagenAlto
        - fondoAlto
      ) / 2,

      fondoAncho,

      fondoAlto

    );


    contexto.filter =
      'none';


    const escala =
      Math.min(

        this.imagenAncho
        / imagen.naturalWidth,

        this.imagenAlto
        / imagen.naturalHeight

      );


    const ancho =
      imagen.naturalWidth
      * escala;


    const alto =
      imagen.naturalHeight
      * escala;


    contexto.drawImage(

      imagen,

      (
        this.imagenAncho
        - ancho
      ) / 2,

      (
        this.imagenAlto
        - alto
      ) / 2,

      ancho,

      alto

    );


    const blob =
      await this.canvasABlob(
        canvas
      );


    const nombre =
      archivo.name
        .replace(
          /\.[^/.]+$/,
          ''
        );


    return new File(
      [
        blob
      ],
      `${nombre}-1200x720.webp`,
      {
        type:
          'image/webp'
      }
    );

  }


  private cargarImagen(
    archivo:
      File
  ): Promise<HTMLImageElement> {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        const url =
          URL.createObjectURL(
            archivo
          );


        const imagen =
          new Image();


        imagen.onload =
          () => {

            URL.revokeObjectURL(
              url
            );


            resolve(
              imagen
            );

          };


        imagen.onerror =
          () => {

            URL.revokeObjectURL(
              url
            );


            reject(
              new Error(
                'No fue posible leer la imagen.'
              )
            );

          };


        imagen.src =
          url;

      }
    );

  }


  private canvasABlob(
    canvas:
      HTMLCanvasElement
  ): Promise<Blob> {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        canvas.toBlob(
          blob => {

            if (
              !blob
            ) {

              reject(
                new Error(
                  'No fue posible optimizar la imagen.'
                )
              );


              return;

            }


            resolve(
              blob
            );

          },

          'image/webp',

          0.88
        );

      }
    );

  }

}