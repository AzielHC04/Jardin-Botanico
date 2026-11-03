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
  Experiencia
} from '../../core/models/experiencia.model';

import {
  ExperienciaImagen
} from '../../core/models/experiencia-imagen.model';

import {
  AdminExperienciasService,
  ExperienciaAdminPayload
} from '../../core/services/admin-experiencias.service';

import {
  AdminExperienciaGaleriaService
} from '../../core/services/admin-experiencia-galeria.service';


type FiltroExperiencia =
  | 'todas'
  | 'activas'
  | 'inactivas'
  | 'destacadas';


@Component({
  selector:
    'app-admin-experiencias',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],

  templateUrl:
    './admin-experiencias.component.html',

  styleUrl:
    './admin-experiencias.component.css'
})
export class AdminExperienciasComponent
implements OnInit {


  private readonly imagenAncho:
    number = 1200;


  private readonly imagenAlto:
    number = 720;


  private readonly imagenMaxBytes:
    number =
      5 * 1024 * 1024;


  experiencias:
    Experiencia[] = [];


  galeria:
    ExperienciaImagen[] = [];


  formulario:
    FormGroup;


  filtroActual:
    FiltroExperiencia =
      'todas';


  cargando:
    boolean = true;


  cargandoGaleria:
    boolean = false;


  guardando:
    boolean = false;


  subiendoImagen:
    boolean = false;


  subiendoGaleria:
    boolean = false;


  errorCarga:
    boolean = false;


  mensajeError:
    string = '';


  mensajeExito:
    string = '';


  mostrarFormulario:
    boolean = false;


  experienciaEditandoId:
    string | null = null;


  experienciaActualizandoId:
    string | null = null;


  imagenActualizandoId:
    string | null = null;


  constructor(

    private adminExperienciasService:
      AdminExperienciasService,

    private galeriaService:
      AdminExperienciaGaleriaService,

    private formBuilder:
      FormBuilder

  ) {


    this.formulario =
      this.formBuilder.group({

        titulo: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(180)
          ]
        ],

        subtitulo: [
          '',
          [
            Validators.maxLength(200)
          ]
        ],

        descripcion: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(2000)
          ]
        ],

        categoria: [
          '',
          [
            Validators.maxLength(80)
          ]
        ],

        etiqueta: [
          '',
          [
            Validators.maxLength(80)
          ]
        ],

        ruta_destino: [
          '',
          [
            Validators.maxLength(200)
          ]
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

        destacada: [
          false
        ],

        activa: [
          true
        ]

      });

  }


  async ngOnInit():
    Promise<void> {

    await this.cargarExperiencias();

  }


  get experienciasFiltradas():
    Experiencia[] {

    switch (
      this.filtroActual
    ) {

      case 'activas':

        return this.experiencias
          .filter(
            experiencia =>
              experiencia.activa
          );


      case 'inactivas':

        return this.experiencias
          .filter(
            experiencia =>
              !experiencia.activa
          );


      case 'destacadas':

        return this.experiencias
          .filter(
            experiencia =>
              experiencia.destacada
          );


      default:

        return this.experiencias;

    }

  }


  get totalActivas():
    number {

    return this.experiencias
      .filter(
        experiencia =>
          experiencia.activa
      )
      .length;

  }


  get totalDestacadas():
    number {

    return this.experiencias
      .filter(
        experiencia =>
          experiencia.destacada
      )
      .length;

  }


  get totalInactivas():
    number {

    return this.experiencias
      .filter(
        experiencia =>
          !experiencia.activa
      )
      .length;

  }


  async cargarExperiencias():
    Promise<void> {

    this.cargando =
      true;


    this.errorCarga =
      false;


    this.mensajeError =
      '';


    try {

      this.experiencias =
        await this.adminExperienciasService
          .obtenerExperiencias();

    }
    catch (error) {

      console.error(
        'No fue posible cargar experiencias:',
        error
      );


      this.experiencias =
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
      FiltroExperiencia
  ): void {

    this.filtroActual =
      filtro;

  }


  nuevaExperiencia():
    void {

    this.experienciaEditandoId =
      null;


    this.galeria =
      [];


    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    const siguienteOrden =
      this.experiencias.length > 0
        ? Math.max(
            ...this.experiencias.map(
              experiencia =>
                experiencia.orden
            )
          ) + 1
        : 1;


    this.formulario.reset({

      titulo: '',

      subtitulo: '',

      descripcion: '',

      categoria: '',

      etiqueta: '',

      ruta_destino: '',

      orden:
        siguienteOrden,

      imagen_url: '',

      destacada: false,

      activa: true

    });


    this.mostrarFormulario =
      true;


    this.irAlFormulario();

  }


  async editarExperiencia(
    experiencia:
      Experiencia
  ): Promise<void> {

    this.experienciaEditandoId =
      experiencia.id;


    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    this.formulario.reset({

      titulo:
        experiencia.titulo,

      subtitulo:
        experiencia.subtitulo
        ?? '',

      descripcion:
        experiencia.descripcion,

      categoria:
        experiencia.categoria
        ?? '',

      etiqueta:
        experiencia.etiqueta
        ?? '',

      ruta_destino:
        experiencia.ruta_destino
        ?? '',

      orden:
        experiencia.orden,

      imagen_url:
        experiencia.imagen_url
        ?? '',

      destacada:
        experiencia.destacada,

      activa:
        experiencia.activa

    });


    this.mostrarFormulario =
      true;


    await this.cargarGaleria(
      experiencia.id
    );


    this.irAlFormulario();

  }


  cancelarFormulario():
    void {

    this.mostrarFormulario =
      false;


    this.experienciaEditandoId =
      null;


    this.galeria =
      [];


    this.mensajeError =
      '';

  }


  async guardarExperiencia():
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
      ExperienciaAdminPayload = {

      titulo:
        String(
          valores.titulo
          ?? ''
        )
          .trim(),

      subtitulo:
        String(
          valores.subtitulo
          ?? ''
        )
          .trim()
        || null,

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

      categoria:
        String(
          valores.categoria
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

      ruta_destino:
        String(
          valores.ruta_destino
          ?? ''
        )
          .trim()
        || null,

      orden:
        Number(
          valores.orden
          ?? 0
        ),

      destacada:
        Boolean(
          valores.destacada
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
        this.experienciaEditandoId
      ) {

        await this.adminExperienciasService
          .actualizarExperiencia(
            this.experienciaEditandoId,
            payload
          );


        this.mensajeExito =
          'Experiencia actualizada correctamente.';

      }
      else {

        const creada =
          await this.adminExperienciasService
            .crearExperiencia(
              payload
            );


        this.experienciaEditandoId =
          creada.id;


        await this.cargarGaleria(
          creada.id
        );


        this.mensajeExito =
          'Experiencia creada. Ya puedes agregar fotografías a la galería.';

      }


      await this.cargarExperiencias();

    }
    catch (error) {

      console.error(
        'No fue posible guardar la experiencia:',
        error
      );


      this.mensajeError =
        'No fue posible guardar la experiencia.';

    }
    finally {

      this.guardando =
        false;

    }

  }


  async cambiarEstado(
    experiencia:
      Experiencia
  ): Promise<void> {

    this.experienciaActualizandoId =
      experiencia.id;


    this.mensajeError =
      '';


    try {

      const nuevoEstado =
        !experiencia.activa;


      await this.adminExperienciasService
        .cambiarEstado(
          experiencia.id,
          nuevoEstado
        );


      experiencia.activa =
        nuevoEstado;

    }
    catch (error) {

      console.error(
        'No fue posible cambiar el estado:',
        error
      );


      this.mensajeError =
        'No fue posible cambiar el estado de la experiencia.';

    }
    finally {

      this.experienciaActualizandoId =
        null;

    }

  }


  /* =========================================================
     GALERÍA
     ========================================================= */

  private async cargarGaleria(
    experienciaId:
      string
  ): Promise<void> {

    this.cargandoGaleria =
      true;


    try {

      this.galeria =
        await this.galeriaService
          .obtenerGaleria(
            experienciaId
          );

    }
    catch (error) {

      console.error(
        'No fue posible cargar la galería:',
        error
      );


      this.galeria =
        [];


      this.mensajeError =
        'No fue posible cargar la galería.';

    }
    finally {

      this.cargandoGaleria =
        false;

    }

  }


  async seleccionarImagenGaleria(
    event:
      Event
  ): Promise<void> {

    if (
      !this.experienciaEditandoId
    ) {

      return;

    }


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


    const archivoOriginal =
      input.files?.item(0);


    if (!archivoOriginal) {

      input.value =
        '';

      return;

    }


    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    if (
      !archivoOriginal.type.startsWith(
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
      archivoOriginal.size
      >
      this.imagenMaxBytes
    ) {

      this.mensajeError =
        'La imagen no puede superar los 5 MB.';


      input.value =
        '';


      return;

    }


    this.subiendoGaleria =
      true;


    try {

      const procesada =
        await this.prepararImagen(
          archivoOriginal
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

          this.experienciaEditandoId,

          url,

          siguienteOrden

        );


      await this.cargarGaleria(
        this.experienciaEditandoId
      );


      this.mensajeExito =
        'Fotografía agregada a la galería.';

    }
    catch (error) {

      console.error(
        'No fue posible agregar fotografía:',
        error
      );


      this.mensajeError =
        error instanceof Error
          ? error.message
          : 'No fue posible agregar la fotografía.';

    }
    finally {

      this.subiendoGaleria =
        false;


      input.value =
        '';

    }

  }


  async actualizarImagenGaleria(
    imagen:
      ExperienciaImagen,

    descripcion:
      string,

    ordenTexto:
      string
  ): Promise<void> {

    this.imagenActualizandoId =
      imagen.id;


    this.mensajeError =
      '';


    try {

      const ordenNumero =
        Number(
          ordenTexto
        );


      const orden =
        Number.isFinite(
          ordenNumero
        )
          ? Math.max(
              0,
              ordenNumero
            )
          : 0;


      await this.galeriaService
        .actualizarImagen(

          imagen.id,

          descripcion.trim()
            || null,

          orden

        );


      if (
        this.experienciaEditandoId
      ) {

        await this.cargarGaleria(
          this.experienciaEditandoId
        );

      }


      this.mensajeExito =
        'Fotografía actualizada.';

    }
    catch (error) {

      console.error(
        'No fue posible actualizar fotografía:',
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


  async cambiarEstadoImagenGaleria(
    imagen:
      ExperienciaImagen
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
        'No fue posible cambiar estado de imagen:',
        error
      );


      this.mensajeError =
        'No fue posible cambiar el estado de la fotografía.';

    }
    finally {

      this.imagenActualizandoId =
        null;

    }

  }


  async eliminarImagenGaleria(
    imagen:
      ExperienciaImagen
  ): Promise<void> {

    const confirmar =
      window.confirm(
        '¿Deseas quitar esta fotografía de la galería?'
      );


    if (!confirmar) {

      return;

    }


    this.imagenActualizandoId =
      imagen.id;


    try {

      await this.galeriaService
        .eliminarImagen(
          imagen.id
        );


      if (
        this.experienciaEditandoId
      ) {

        await this.cargarGaleria(
          this.experienciaEditandoId
        );

      }


      this.mensajeExito =
        'Fotografía eliminada de la galería.';

    }
    catch (error) {

      console.error(
        'No fue posible eliminar fotografía:',
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
     IMAGEN PRINCIPAL
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


    const archivoOriginal =
      input.files?.item(0);


    if (!archivoOriginal) {

      input.value =
        '';

      return;

    }


    if (
      !archivoOriginal.type.startsWith(
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
      archivoOriginal.size
      >
      this.imagenMaxBytes
    ) {

      this.mensajeError =
        'La imagen no puede superar los 5 MB.';


      input.value =
        '';


      return;

    }


    this.subiendoImagen =
      true;


    try {

      const procesada =
        await this.prepararImagen(
          archivoOriginal
        );


      const url =
        await this.adminExperienciasService
          .subirImagen(
            procesada
          );


      const control =
        this.formulario
          .get(
            'imagen_url'
          );


      control?.setValue(
        url
      );


      control?.markAsDirty();


      this.mensajeExito =
        'Imagen principal cargada correctamente.';

    }
    catch (error) {

      console.error(
        'No fue posible procesar la imagen:',
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


  /* =========================================================
     PROCESADOR 1200 × 720
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


    if (!contexto) {

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


    const fondoX =
      (
        this.imagenAncho
        - fondoAncho
      )
      / 2;


    const fondoY =
      (
        this.imagenAlto
        - fondoAlto
      )
      / 2;


    contexto.filter =
      'blur(28px) brightness(0.68)';


    contexto.drawImage(
      imagen,
      fondoX,
      fondoY,
      fondoAncho,
      fondoAlto
    );


    contexto.filter =
      'none';


    contexto.fillStyle =
      'rgba(11, 43, 34, 0.08)';


    contexto.fillRect(
      0,
      0,
      this.imagenAncho,
      this.imagenAlto
    );


    const escalaPrincipal =
      Math.min(

        this.imagenAncho
        / imagen.naturalWidth,

        this.imagenAlto
        / imagen.naturalHeight

      );


    const ancho =
      imagen.naturalWidth
      * escalaPrincipal;


    const alto =
      imagen.naturalHeight
      * escalaPrincipal;


    const x =
      (
        this.imagenAncho
        - ancho
      )
      / 2;


    const y =
      (
        this.imagenAlto
        - alto
      )
      / 2;


    contexto.drawImage(
      imagen,
      x,
      y,
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


  campoInvalido(
    campo:
      string
  ): boolean {

    const control =
      this.formulario
        .get(
          campo
        );


    if (!control) {

      return false;

    }


    return (
      control.invalid
      &&
      (
        control.touched
        ||
        control.dirty
      )
    );

  }


  private irAlFormulario():
    void {

    setTimeout(
      () => {

        document
          .getElementById(
            'editor-experiencia'
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