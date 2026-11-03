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
  ColeccionBotanica
} from '../../core/models/coleccion-botanica.model';

import {
  AdminJardinService,
  ColeccionBotanicaPayload
} from '../../core/services/admin-jardin.service';


type FiltroColeccion =
  | 'todas'
  | 'activas'
  | 'inactivas';


@Component({
  selector:
    'app-admin-jardin',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],

  templateUrl:
    './admin-jardin.component.html',

  styleUrl:
    './admin-jardin.component.css'
})
export class AdminJardinComponent
implements OnInit {


  private readonly imagenAncho:
    number = 1200;


  private readonly imagenAlto:
    number = 800;


  private readonly maxBytes:
    number =
      5 * 1024 * 1024;


  colecciones:
    ColeccionBotanica[] = [];


  formulario:
    FormGroup;


  filtroActual:
    FiltroColeccion =
      'todas';


  cargando:
    boolean = true;


  guardando:
    boolean = false;


  subiendoImagen:
    boolean = false;


  errorCarga:
    boolean = false;


  mensajeError:
    string = '';


  mensajeExito:
    string = '';


  mostrarFormulario:
    boolean = false;


  coleccionEditandoId:
    string | null = null;


  coleccionActualizandoId:
    string | null = null;


  constructor(

    private formBuilder:
      FormBuilder,

    private jardinService:
      AdminJardinService

  ) {


    this.formulario =
      this.formBuilder.group({

        titulo: [
          '',
          [
            Validators.required,
            Validators.minLength(3)
          ]
        ],

        descripcion: [
          '',
          [
            Validators.required,
            Validators.minLength(5)
          ]
        ],

        etiqueta: [
          ''
        ],

        orden: [
          1,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        imagen_url: [
          ''
        ],

        activa: [
          true
        ]

      });

  }


  async ngOnInit():
    Promise<void> {

    await this.cargarColecciones();

  }


  get coleccionesFiltradas():
    ColeccionBotanica[] {

    switch (
      this.filtroActual
    ) {

      case 'activas':

        return this.colecciones
          .filter(
            coleccion =>
              coleccion.activa
          );


      case 'inactivas':

        return this.colecciones
          .filter(
            coleccion =>
              !coleccion.activa
          );


      default:

        return this.colecciones;

    }

  }


  get totalActivas():
    number {

    return this.colecciones
      .filter(
        coleccion =>
          coleccion.activa
      )
      .length;

  }


  get totalInactivas():
    number {

    return this.colecciones
      .filter(
        coleccion =>
          !coleccion.activa
      )
      .length;

  }


  async cargarColecciones():
    Promise<void> {

    this.cargando =
      true;


    this.errorCarga =
      false;


    try {

      this.colecciones =
        await this.jardinService
          .obtenerColecciones();

    }
    catch (error) {

      console.error(
        'No fue posible cargar colecciones:',
        error
      );


      this.colecciones =
        [];


      this.errorCarga =
        true;

    }
    finally {

      this.cargando =
        false;

    }

  }


  cambiarFiltro(
    filtro:
      FiltroColeccion
  ): void {

    this.filtroActual =
      filtro;

  }


  nuevaColeccion():
    void {

    this.coleccionEditandoId =
      null;


    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    const siguienteOrden =
      this.colecciones.length > 0
        ? Math.max(
            ...this.colecciones.map(
              item =>
                item.orden
            )
          ) + 1
        : 1;


    this.formulario.reset({

      titulo: '',

      descripcion: '',

      etiqueta: '',

      orden:
        siguienteOrden,

      imagen_url: '',

      activa:
        true

    });


    this.mostrarFormulario =
      true;


    this.irAlFormulario();

  }


  editarColeccion(
    coleccion:
      ColeccionBotanica
  ): void {

    this.coleccionEditandoId =
      coleccion.id;


    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    this.formulario.reset({

      titulo:
        coleccion.titulo,

      descripcion:
        coleccion.descripcion,

      etiqueta:
        coleccion.etiqueta
        ?? '',

      orden:
        coleccion.orden,

      imagen_url:
        coleccion.imagen_url
        ?? '',

      activa:
        coleccion.activa

    });


    this.mostrarFormulario =
      true;


    this.irAlFormulario();

  }


  cancelarFormulario():
    void {

    this.mostrarFormulario =
      false;


    this.coleccionEditandoId =
      null;

  }


  async guardarColeccion():
    Promise<void> {

    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    if (
      this.formulario.invalid
    ) {

      this.formulario
        .markAllAsTouched();


      this.mensajeError =
        'Revisa los campos obligatorios.';


      return;

    }


    const valores =
      this.formulario
        .getRawValue();


    const payload:
      ColeccionBotanicaPayload = {

      titulo:
        String(
          valores.titulo
          ?? ''
        )
          .trim(),

      descripcion:
        String(
          valores.descripcion
          ?? ''
        )
          .trim(),

      imagen_url:
        String(
          valores.imagen_url
          ?? ''
        )
          .trim()
        || null,

      etiqueta:
        String(
          valores.etiqueta
          ?? ''
        )
          .trim()
        || null,

      orden:
        Number(
          valores.orden
          ?? 0
        ),

      activa:
        Boolean(
          valores.activa
        )

    };


    this.guardando =
      true;


    try {

      if (
        this.coleccionEditandoId
      ) {

        await this.jardinService
          .actualizarColeccion(

            this.coleccionEditandoId,

            payload

          );


        this.mensajeExito =
          'Colección actualizada correctamente.';

      }
      else {

        await this.jardinService
          .crearColeccion(
            payload
          );


        this.mensajeExito =
          'Colección creada correctamente.';

      }


      await this.cargarColecciones();


      this.mostrarFormulario =
        false;


      this.coleccionEditandoId =
        null;

    }
    catch (error) {

      console.error(
        'No fue posible guardar colección:',
        error
      );


      this.mensajeError =
        'No fue posible guardar la colección.';

    }
    finally {

      this.guardando =
        false;

    }

  }


  async cambiarEstado(
    coleccion:
      ColeccionBotanica
  ): Promise<void> {

    this.coleccionActualizandoId =
      coleccion.id;


    try {

      const nuevoEstado =
        !coleccion.activa;


      await this.jardinService
        .cambiarEstado(

          coleccion.id,

          nuevoEstado

        );


      coleccion.activa =
        nuevoEstado;

    }
    catch (error) {

      console.error(
        'No fue posible cambiar colección:',
        error
      );


      this.mensajeError =
        'No fue posible cambiar el estado.';

    }
    finally {

      this.coleccionActualizandoId =
        null;

    }

  }


  /* =========================================================
     IMAGEN
     ========================================================= */

  async seleccionarImagen(
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
      this.maxBytes
    ) {

      this.mensajeError =
        'La imagen no puede superar los 5 MB.';


      input.value =
        '';

      return;

    }


    this.subiendoImagen =
      true;


    this.mensajeError =
      '';


    try {

      const procesada =
        await this.prepararImagen(
          archivo
        );


      const url =
        await this.jardinService
          .subirImagen(
            procesada
          );


      this.formulario
        .get(
          'imagen_url'
        )
        ?.setValue(
          url
        );


      this.mensajeExito =
        'Imagen adaptada a 1200 × 800 px.';

    }
    catch (error) {

      console.error(
        'No fue posible procesar imagen:',
        error
      );


      this.mensajeError =
        error instanceof Error
          ? error.message
          : 'No fue posible procesar la imagen.';

    }
    finally {

      this.subiendoImagen =
        false;


      input.value =
        '';

    }

  }


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


    if (!contexto) {

      throw new Error(
        'No fue posible procesar la imagen.'
      );

    }


    /* FONDO */

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
      'blur(30px) brightness(0.65)';


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


    /* FOTO PRINCIPAL */

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
      `${nombre}-1200x800.webp`,
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


  private irAlFormulario():
    void {

    setTimeout(
      () => {

        document
          .getElementById(
            'editor-coleccion'
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