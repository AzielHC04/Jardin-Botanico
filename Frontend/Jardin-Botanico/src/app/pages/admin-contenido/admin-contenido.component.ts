import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  Banner
} from '../../core/models/banner.model';

import {
  AdminContenidoService,
  BannerAdminPayload,
  ConfiguracionSitioPayload
} from '../../core/services/admin-contenido.service';


type SeccionContenido =
  | 'general'
  | 'banners';


@Component({
  selector:
    'app-admin-contenido',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],

  templateUrl:
    './admin-contenido.component.html',

  styleUrl:
    './admin-contenido.component.css'
})
export class AdminContenidoComponent
implements OnInit {


  /* =========================================================
     IMAGEN BANNER
     ========================================================= */

  private readonly bannerAncho:
    number = 1600;


  private readonly bannerAlto:
    number = 700;


  private readonly imagenMaxBytes:
    number =
      5 * 1024 * 1024;


  /* =========================================================
     DATOS
     ========================================================= */

  banners:
    Banner[] = [];


  seccionActual:
    SeccionContenido =
      'general';


  formularioGeneral:
    FormGroup;


  formularioBanner:
    FormGroup;


  /* =========================================================
     ESTADOS
     ========================================================= */

  cargando:
    boolean = true;


  guardandoGeneral:
    boolean = false;


  guardandoBanner:
    boolean = false;


  subiendoBanner:
    boolean = false;


  errorCarga:
    boolean = false;


  mensajeError:
    string = '';


  mensajeExito:
    string = '';


  mostrarEditorBanner:
    boolean = false;


  bannerEditandoId:
    string | null = null;


  bannerActualizandoId:
    string | null = null;


  constructor(

    private formBuilder:
      FormBuilder,

    private contenidoService:
      AdminContenidoService

  ) {


    this.formularioGeneral =
      this.formBuilder.group({

        nombre: [
          '',
          [
            Validators.required
          ]
        ],

        subtitulo: [
          ''
        ],

        descripcion: [
          ''
        ],

        direccion: [
          '',
          [
            Validators.required
          ]
        ],

        referencia: [
          ''
        ],

        telefono: [
          ''
        ],

        whatsapp: [
          ''
        ],

        email: [
          '',
          [
            Validators.email
          ]
        ],

        horarios_atencion: [
          ''
        ],

        google_maps_url: [
          ''
        ],

        mapa_embed_url: [
          ''
        ]

      });


    this.formularioBanner =
      this.formBuilder.group({

        titulo: [
          ''
        ],

        descripcion: [
          ''
        ],

        imagen_url: [
          '',
          [
            Validators.required
          ]
        ],

        texto_boton: [
          ''
        ],

        ruta_boton: [
          ''
        ],

        orden: [
          1,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        activo: [
          true
        ]

      });

  }


  /* =========================================================
     INICIO
     ========================================================= */

  async ngOnInit():
    Promise<void> {

    await Promise.all([

      this.cargarConfiguracion(),

      this.cargarBanners()

    ]);


    this.cargando =
      false;

  }


  /* =========================================================
     NAVEGACIÓN
     ========================================================= */

  cambiarSeccion(
    seccion:
      SeccionContenido
  ): void {

    this.seccionActual =
      seccion;


    this.mensajeError =
      '';


    this.mensajeExito =
      '';

  }


  /* =========================================================
     CONFIGURACIÓN GENERAL
     ========================================================= */

  private async cargarConfiguracion():
    Promise<void> {

    try {

      const configuracion =
        await this.contenidoService
          .obtenerConfiguracion();


      this.formularioGeneral.reset({

        nombre:
          configuracion.nombre,

        subtitulo:
          configuracion.subtitulo
          ?? '',

        descripcion:
          configuracion.descripcion
          ?? '',

        direccion:
          configuracion.direccion,

        referencia:
          configuracion.referencia
          ?? '',

        telefono:
          configuracion.telefono
          ?? '',

        whatsapp:
          configuracion.whatsapp
          ?? '',

        email:
          configuracion.email
          ?? '',

        horarios_atencion:
          configuracion.horarios_atencion
          ?? '',

        google_maps_url:
          configuracion.google_maps_url
          ?? '',

        mapa_embed_url:
          configuracion.mapa_embed_url
          ?? ''

      });

    }
    catch (error) {

      console.error(
        'No fue posible cargar configuración:',
        error
      );


      this.errorCarga =
        true;

    }

  }


  async guardarConfiguracion():
    Promise<void> {

    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    if (
      this.formularioGeneral.invalid
    ) {

      this.formularioGeneral
        .markAllAsTouched();


      this.mensajeError =
        'Revisa los campos de configuración.';


      return;

    }


    const valores =
      this.formularioGeneral
        .getRawValue();


    const payload:
      ConfiguracionSitioPayload = {

      nombre:
        String(
          valores.nombre
          ?? ''
        )
          .trim(),

      subtitulo:
        this.textoOpcional(
          valores.subtitulo
        ),

      descripcion:
        this.textoOpcional(
          valores.descripcion
        ),

      direccion:
        String(
          valores.direccion
          ?? ''
        )
          .trim(),

      referencia:
        this.textoOpcional(
          valores.referencia
        ),

      telefono:
        this.textoOpcional(
          valores.telefono
        ),

      whatsapp:
        this.textoOpcional(
          valores.whatsapp
        ),

      email:
        this.textoOpcional(
          valores.email
        ),

      horarios_atencion:
        this.textoOpcional(
          valores.horarios_atencion
        ),

      google_maps_url:
        this.textoOpcional(
          valores.google_maps_url
        ),

      mapa_embed_url:
        this.textoOpcional(
          valores.mapa_embed_url
        )

    };


    this.guardandoGeneral =
      true;


    try {

      await this.contenidoService
        .actualizarConfiguracion(
          payload
        );


      this.mensajeExito =
        'Información general actualizada correctamente.';

    }
    catch (error) {

      console.error(
        'No fue posible guardar configuración:',
        error
      );


      this.mensajeError =
        'No fue posible guardar la información general.';

    }
    finally {

      this.guardandoGeneral =
        false;

    }

  }


  /* =========================================================
     BANNERS
     ========================================================= */

  private async cargarBanners():
    Promise<void> {

    try {

      this.banners =
        await this.contenidoService
          .obtenerBanners();

    }
    catch (error) {

      console.error(
        'No fue posible cargar banners:',
        error
      );


      this.errorCarga =
        true;


      this.banners =
        [];

    }

  }


  nuevoBanner():
    void {

    this.bannerEditandoId =
      null;


    const siguienteOrden =
      this.banners.length > 0
        ? Math.max(
            ...this.banners.map(
              banner =>
                banner.orden
            )
          ) + 1
        : 1;


    this.formularioBanner.reset({

      titulo: '',

      descripcion: '',

      imagen_url: '',

      texto_boton: '',

      ruta_boton: '',

      orden:
        siguienteOrden,

      activo:
        true

    });


    this.mostrarEditorBanner =
      true;


    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    this.irEditorBanner();

  }


  editarBanner(
    banner:
      Banner
  ): void {

    this.bannerEditandoId =
      banner.id;


    this.formularioBanner.reset({

      titulo:
        banner.titulo
        ?? '',

      descripcion:
        banner.descripcion
        ?? '',

      imagen_url:
        banner.imagen_url,

      texto_boton:
        banner.texto_boton
        ?? '',

      ruta_boton:
        banner.ruta_boton
        ?? '',

      orden:
        banner.orden,

      activo:
        banner.activo

    });


    this.mostrarEditorBanner =
      true;


    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    this.irEditorBanner();

  }


  cancelarBanner():
    void {

    this.mostrarEditorBanner =
      false;


    this.bannerEditandoId =
      null;

  }


  async guardarBanner():
    Promise<void> {

    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    if (
      this.formularioBanner.invalid
    ) {

      this.formularioBanner
        .markAllAsTouched();


      this.mensajeError =
        'La imagen del banner es obligatoria.';


      return;

    }


    const valores =
      this.formularioBanner
        .getRawValue();


    const payload:
      BannerAdminPayload = {

      titulo:
        this.textoOpcional(
          valores.titulo
        ),

      descripcion:
        this.textoOpcional(
          valores.descripcion
        ),

      imagen_url:
        String(
          valores.imagen_url
          ?? ''
        )
          .trim(),

      texto_boton:
        this.textoOpcional(
          valores.texto_boton
        ),

      ruta_boton:
        this.textoOpcional(
          valores.ruta_boton
        ),

      orden:
        Number(
          valores.orden
          ?? 0
        ),

      activo:
        Boolean(
          valores.activo
        )

    };


    this.guardandoBanner =
      true;


    try {

      if (
        this.bannerEditandoId
      ) {

        await this.contenidoService
          .actualizarBanner(

            this.bannerEditandoId,

            payload

          );


        this.mensajeExito =
          'Banner actualizado correctamente.';

      }
      else {

        await this.contenidoService
          .crearBanner(
            payload
          );


        this.mensajeExito =
          'Banner creado correctamente.';

      }


      await this.cargarBanners();


      this.mostrarEditorBanner =
        false;


      this.bannerEditandoId =
        null;

    }
    catch (error) {

      console.error(
        'No fue posible guardar banner:',
        error
      );


      this.mensajeError =
        'No fue posible guardar el banner.';

    }
    finally {

      this.guardandoBanner =
        false;

    }

  }


  async cambiarEstadoBanner(
    banner:
      Banner
  ): Promise<void> {

    this.bannerActualizandoId =
      banner.id;


    try {

      const nuevoEstado =
        !banner.activo;


      await this.contenidoService
        .cambiarEstadoBanner(

          banner.id,

          nuevoEstado

        );


      banner.activo =
        nuevoEstado;

    }
    catch (error) {

      console.error(
        'No fue posible cambiar banner:',
        error
      );


      this.mensajeError =
        'No fue posible cambiar el estado del banner.';

    }
    finally {

      this.bannerActualizandoId =
        null;

    }

  }


  /* =========================================================
     IMAGEN BANNER
     ========================================================= */

  async seleccionarImagenBanner(
    event:
      Event
  ): Promise<void> {

    const input =
      event.target;


    if (
      !(
        input instanceof
        HTMLInputElement
      )
    ) {

      return;

    }


    const archivo =
      input.files?.item(0);


    if (!archivo) {

      input.value =
        '';

      return;

    }


    if (
      !archivo.type.startsWith(
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
      archivo.size >
      this.imagenMaxBytes
    ) {

      this.mensajeError =
        'La imagen no puede superar los 5 MB.';


      input.value =
        '';

      return;

    }


    this.subiendoBanner =
      true;


    this.mensajeError =
      '';


    try {

      const procesada =
        await this.prepararBanner(
          archivo
        );


      const url =
        await this.contenidoService
          .subirImagenBanner(
            procesada
          );


      this.formularioBanner
        .get(
          'imagen_url'
        )
        ?.setValue(
          url
        );


      this.mensajeExito =
        'Imagen adaptada a 1600 × 700 px.';

    }
    catch (error) {

      console.error(
        'No fue posible procesar banner:',
        error
      );


      this.mensajeError =
        error instanceof Error
          ? error.message
          : 'No fue posible procesar la imagen.';

    }
    finally {

      this.subiendoBanner =
        false;


      input.value =
        '';

    }

  }


  /* =========================================================
     PROCESAR BANNER
     ========================================================= */

  private async prepararBanner(
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
      this.bannerAncho;


    canvas.height =
      this.bannerAlto;


    const contexto =
      canvas.getContext(
        '2d'
      );


    if (!contexto) {

      throw new Error(
        'No fue posible procesar la imagen.'
      );

    }


    /* FONDO */

    const escalaFondo =
      Math.max(

        this.bannerAncho
        / imagen.naturalWidth,

        this.bannerAlto
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
      'blur(32px) brightness(0.62)';


    contexto.drawImage(

      imagen,

      (
        this.bannerAncho
        - fondoAncho
      ) / 2,

      (
        this.bannerAlto
        - fondoAlto
      ) / 2,

      fondoAncho,

      fondoAlto

    );


    contexto.filter =
      'none';


    /* IMAGEN PRINCIPAL */

    const escala =
      Math.min(

        this.bannerAncho
        / imagen.naturalWidth,

        this.bannerAlto
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
        this.bannerAncho
        - ancho
      ) / 2,

      (
        this.bannerAlto
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
      `${nombre}-1600x700.webp`,
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

            if (!blob) {

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


  /* =========================================================
     UTILIDADES
     ========================================================= */

  private textoOpcional(
    valor:
      unknown
  ): string | null {

    const texto =
      String(
        valor
        ?? ''
      )
        .trim();


    return texto
      || null;

  }


  private irEditorBanner():
    void {

    setTimeout(
      () => {

        document
          .getElementById(
            'editor-banner'
          )
          ?.scrollIntoView({

            behavior:
              'smooth',

            block:
              'start'

          });

      },
      50
    );

  }

}