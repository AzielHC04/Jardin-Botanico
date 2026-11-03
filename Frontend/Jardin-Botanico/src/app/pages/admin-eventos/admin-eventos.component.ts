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
  Evento
} from '../../core/models/evento.model';

import {
  AdminService,
  EventoAdminPayload
} from '../../core/services/admin.service';


type FiltroEvento =
  | 'todos'
  | 'activos'
  | 'inactivos'
  | 'regulares'
  | 'especiales';


@Component({
  selector: 'app-admin-eventos',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],

  templateUrl:
    './admin-eventos.component.html',

  styleUrl:
    './admin-eventos.component.css'
})
export class AdminEventosComponent
implements OnInit {


  /* =========================================================
     CONFIGURACIÓN DE IMÁGENES
     ========================================================= */

  private readonly imagenAncho:
    number = 1200;


  private readonly imagenAlto:
    number = 720;


  private readonly imagenMaxBytes:
    number =
      5 * 1024 * 1024;


  /* =========================================================
     DATOS
     ========================================================= */

  eventos:
    Evento[] = [];


  formulario:
    FormGroup;


  filtroActual:
    FiltroEvento =
      'todos';


  /* =========================================================
     ESTADOS
     ========================================================= */

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


  eventoEditandoId:
    string | null = null;


  eventoActualizandoId:
    string | null = null;


  /* =========================================================
     CONSTRUCTOR
     ========================================================= */

  constructor(

    private adminService:
      AdminService,

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

        fecha_inicio: [
          '',
          [
            Validators.required
          ]
        ],

        fecha_fin: [
          ''
        ],

        precio: [
          null,
          [
            Validators.min(0)
          ]
        ],

        moneda: [
          'MXN',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(3)
          ]
        ],

        precio_texto: [
          '',
          [
            Validators.maxLength(80)
          ]
        ],

        cupo_total: [
          null,
          [
            Validators.min(1)
          ]
        ],

        imagen_url: [
          ''
        ],

        tipo: [
          'regular',
          [
            Validators.required
          ]
        ],

        etiqueta: [
          '',
          [
            Validators.maxLength(80)
          ]
        ],

        destacado: [
          false
        ],

        activo: [
          true
        ],

        requiere_pago: [
          false
        ]

      });

  }


  /* =========================================================
     CICLO DE VIDA
     ========================================================= */

  async ngOnInit():
    Promise<void> {

    await this.cargarEventos();

  }


  /* =========================================================
     EVENTOS FILTRADOS
     ========================================================= */

  get eventosFiltrados():
    Evento[] {

    switch (
      this.filtroActual
    ) {

      case 'activos':

        return this.eventos
          .filter(
            evento =>
              evento.activo
          );


      case 'inactivos':

        return this.eventos
          .filter(
            evento =>
              !evento.activo
          );


      case 'regulares':

        return this.eventos
          .filter(
            evento =>
              evento.tipo ===
              'regular'
          );


      case 'especiales':

        return this.eventos
          .filter(
            evento =>
              evento.tipo ===
              'especial'
          );


      default:

        return this.eventos;

    }

  }


  /* =========================================================
     CONTADORES
     ========================================================= */

  get totalActivos():
    number {

    return this.eventos
      .filter(
        evento =>
          evento.activo
      )
      .length;

  }


  get totalDestacados():
    number {

    return this.eventos
      .filter(
        evento =>
          evento.destacado
      )
      .length;

  }


  get totalEspeciales():
    number {

    return this.eventos
      .filter(
        evento =>
          evento.tipo ===
          'especial'
      )
      .length;

  }


  /* =========================================================
     CARGAR EVENTOS
     ========================================================= */

  async cargarEventos():
    Promise<void> {

    this.cargando =
      true;


    this.errorCarga =
      false;


    this.mensajeError =
      '';


    try {

      this.eventos =
        await this.adminService
          .obtenerEventosAdmin();

    }
    catch (error) {

      console.error(
        'No fue posible cargar eventos:',
        error
      );


      this.eventos =
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
     FILTROS
     ========================================================= */

  cambiarFiltro(
    filtro:
      FiltroEvento
  ): void {

    this.filtroActual =
      filtro;

  }


  /* =========================================================
     NUEVO EVENTO
     ========================================================= */

  nuevoEvento():
    void {

    this.eventoEditandoId =
      null;


    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    this.formulario.reset({

      titulo: '',

      subtitulo: '',

      descripcion: '',

      fecha_inicio: '',

      fecha_fin: '',

      precio: null,

      moneda: 'MXN',

      precio_texto: '',

      cupo_total: null,

      imagen_url: '',

      tipo: 'regular',

      etiqueta: '',

      destacado: false,

      activo: true,

      requiere_pago: false

    });


    this.mostrarFormulario =
      true;


    this.irAlFormulario();

  }


  /* =========================================================
     EDITAR EVENTO
     ========================================================= */

  editarEvento(
    evento:
      Evento
  ): void {

    this.eventoEditandoId =
      evento.id;


    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    this.formulario.reset({

      titulo:
        evento.titulo,

      subtitulo:
        evento.subtitulo
        ?? '',

      descripcion:
        evento.descripcion,

      fecha_inicio:
        this.convertirIsoADatetimeLocal(
          evento.fecha_inicio
        ),

      fecha_fin:
        this.convertirIsoADatetimeLocal(
          evento.fecha_fin
        ),

      precio:
        evento.precio,

      moneda:
        evento.moneda,

      precio_texto:
        evento.precio_texto
        ?? '',

      cupo_total:
        evento.cupo_total,

      imagen_url:
        evento.imagen_url
        ?? '',

      tipo:
        evento.tipo,

      etiqueta:
        evento.etiqueta
        ?? '',

      destacado:
        evento.destacado,

      activo:
        evento.activo,

      requiere_pago:
        evento.requiere_pago

    });


    this.mostrarFormulario =
      true;


    this.irAlFormulario();

  }


  /* =========================================================
     CANCELAR
     ========================================================= */

  cancelarFormulario():
    void {

    this.mostrarFormulario =
      false;


    this.eventoEditandoId =
      null;


    this.mensajeError =
      '';

  }


  /* =========================================================
     GUARDAR EVENTO
     ========================================================= */

  async guardarEvento():
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
        'Revisa los campos obligatorios del formulario.';


      return;

    }


    const valores =
      this.formulario
        .getRawValue();


    /* =======================================================
       PRECIO
       ======================================================= */

    let precio:
      number | null =
        null;


    if (
      valores.precio !== null
      &&
      valores.precio !== ''
      &&
      valores.precio !== undefined
    ) {

      precio =
        Number(
          valores.precio
        );

    }


    /* =======================================================
       CUPO
       ======================================================= */

    let cupo:
      number | null =
        null;


    if (
      valores.cupo_total !== null
      &&
      valores.cupo_total !== ''
      &&
      valores.cupo_total !== undefined
    ) {

      cupo =
        Number(
          valores.cupo_total
        );

    }


    /* =======================================================
       VALIDAR PAGO
       ======================================================= */

    if (
      valores.requiere_pago
      &&
      (
        precio === null
        ||
        precio <= 0
      )
    ) {

      this.mensajeError =
        'Un evento que requiere pago debe tener un precio mayor a $0.';


      return;

    }


    /* =======================================================
       FECHAS
       ======================================================= */

    const inicio =
      this.convertirDatetimeLocalAFecha(
        valores.fecha_inicio
      );


    if (!inicio) {

      this.mensajeError =
        'La fecha de inicio no es válida.';


      return;

    }


    let fin:
      Date | null =
        null;


    if (
      valores.fecha_fin
    ) {

      fin =
        this.convertirDatetimeLocalAFecha(
          valores.fecha_fin
        );


      if (!fin) {

        this.mensajeError =
          'La fecha de finalización no es válida.';


        return;

      }


      if (
        fin.getTime()
        <
        inicio.getTime()
      ) {

        this.mensajeError =
          'La fecha de finalización no puede ser anterior al inicio.';


        return;

      }

    }


    /* =======================================================
       PAYLOAD
       ======================================================= */

    const tipoEvento:
      'regular' | 'especial' =
        valores.tipo ===
        'especial'
          ? 'especial'
          : 'regular';


    const payload:
      EventoAdminPayload = {

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

      fecha_inicio:
        inicio.toISOString(),

      fecha_fin:
        fin
          ? fin.toISOString()
          : null,

      precio,

      moneda:
        String(
          valores.moneda
          ?? 'MXN'
        )
          .trim()
          .toUpperCase(),

      precio_texto:
        String(
          valores.precio_texto
          ?? ''
        )
          .trim()
        || null,

      cupo_total:
        cupo,

      imagen_url:
        String(
          valores.imagen_url
          ?? ''
        )
          .trim()
        || null,

      tipo:
        tipoEvento,

      etiqueta:
        String(
          valores.etiqueta
          ?? ''
        )
          .trim()
        || null,

      destacado:
        Boolean(
          valores.destacado
        ),

      activo:
        Boolean(
          valores.activo
        ),

      requiere_pago:
        Boolean(
          valores.requiere_pago
        )

    };


    /* =======================================================
       GUARDAR
       ======================================================= */

    this.guardando =
      true;


    try {

      if (
        this.eventoEditandoId
      ) {

        await this.adminService
          .actualizarEvento(
            this.eventoEditandoId,
            payload
          );


        this.mensajeExito =
          'Evento actualizado correctamente.';

      }
      else {

        await this.adminService
          .crearEvento(
            payload
          );


        this.mensajeExito =
          'Evento creado correctamente.';

      }


      await this.cargarEventos();


      this.mostrarFormulario =
        false;


      this.eventoEditandoId =
        null;


      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }
    catch (error) {

      console.error(
        'No fue posible guardar el evento:',
        error
      );


      this.mensajeError =
        'No fue posible guardar el evento. Revisa los datos e inténtalo nuevamente.';

    }
    finally {

      this.guardando =
        false;

    }

  }


  /* =========================================================
     ACTIVAR / DESACTIVAR
     ========================================================= */

  async cambiarActivo(
    evento:
      Evento
  ): Promise<void> {

    this.eventoActualizandoId =
      evento.id;


    this.mensajeError =
      '';


    try {

      const nuevoEstado =
        !evento.activo;


      await this.adminService
        .actualizarActivoEvento(
          evento.id,
          nuevoEstado
        );


      evento.activo =
        nuevoEstado;

    }
    catch (error) {

      console.error(
        'No fue posible cambiar el estado:',
        error
      );


      this.mensajeError =
        'No fue posible cambiar el estado del evento.';

    }
    finally {

      this.eventoActualizandoId =
        null;

    }

  }


  /* =========================================================
     SELECCIONAR IMAGEN
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


    this.mensajeError =
      '';


    this.mensajeExito =
      '';


    /* =======================================================
       VALIDACIÓN ORIGINAL
       ======================================================= */

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

      /*
       * Convertimos cualquier imagen admitida
       * a un WebP uniforme de 1200 × 720.
       */

      const imagenProcesada =
        await this.prepararImagenEvento(
          archivoOriginal
        );


      const url =
        await this.adminService
          .subirImagenEvento(
            imagenProcesada
          );


      const controlImagen =
        this.formulario
          .get(
            'imagen_url'
          );


      controlImagen
        ?.setValue(
          url
        );


      controlImagen
        ?.markAsDirty();


      this.mensajeExito =
        'Imagen adaptada a 1200 × 720 px y cargada correctamente.';

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
     PREPARAR IMAGEN

     Resultado:
     1200 × 720
     WebP
     Sin recortar la fotografía principal.

     Si la imagen original tiene otra relación,
     utilizamos la misma fotografía desenfocada
     como fondo.
     ========================================================= */

  private async prepararImagenEvento(
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


    /* =======================================================
       FONDO
       ======================================================= */

    contexto.fillStyle =
      '#0b2b22';


    contexto.fillRect(
      0,
      0,
      this.imagenAncho,
      this.imagenAlto
    );


    /*
     * Fondo tipo COVER.
     * Lo ampliamos ligeramente para evitar
     * bordes producidos por el blur.
     */

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


    /*
     * Capa suave para integrar
     * mejor el fondo.
     */

    contexto.fillStyle =
      'rgba(11, 43, 34, 0.08)';


    contexto.fillRect(
      0,
      0,
      this.imagenAncho,
      this.imagenAlto
    );


    /* =======================================================
       FOTOGRAFÍA PRINCIPAL

       CONTAIN:
       nunca cortamos el contenido.
       ======================================================= */

    const escalaPrincipal =
      Math.min(
        this.imagenAncho
          / imagen.naturalWidth,

        this.imagenAlto
          / imagen.naturalHeight
      );


    const principalAncho =
      imagen.naturalWidth
      * escalaPrincipal;


    const principalAlto =
      imagen.naturalHeight
      * escalaPrincipal;


    const principalX =
      (
        this.imagenAncho
        - principalAncho
      )
      / 2;


    const principalY =
      (
        this.imagenAlto
        - principalAlto
      )
      / 2;


    contexto.drawImage(
      imagen,
      principalX,
      principalY,
      principalAncho,
      principalAlto
    );


    /* =======================================================
       EXPORTAR WEBP
       ======================================================= */

    const blob =
      await this.canvasABlob(
        canvas
      );


    const nombreBase =
      archivo.name
        .replace(
          /\.[^/.]+$/,
          ''
        );


    return new File(
      [
        blob
      ],
      `${nombreBase}-1200x720.webp`,
      {
        type:
          'image/webp'
      }
    );

  }


  /* =========================================================
     CARGAR ARCHIVO COMO IMAGEN
     ========================================================= */

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
                'No fue posible leer la imagen seleccionada.'
              )
            );

          };


        imagen.src =
          url;

      }
    );

  }


  /* =========================================================
     CANVAS → BLOB
     ========================================================= */

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
     VALIDACIÓN CAMPOS
     ========================================================= */

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


  /* =========================================================
     FORMATO FECHA
     ========================================================= */

  formatearFecha(
    fecha:
      string
  ): string {

    return new Intl.DateTimeFormat(
      'es-MX',
      {

        weekday:
          'short',

        day:
          'numeric',

        month:
          'short',

        year:
          'numeric',

        hour:
          '2-digit',

        minute:
          '2-digit',

        hour12:
          true,

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
     PRECIO
     ========================================================= */

  formatearPrecio(
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
          evento.moneda
          || 'MXN',

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
     DATETIME LOCAL → DATE
     ========================================================= */

  private convertirDatetimeLocalAFecha(
    valor:
      string
  ): Date | null {

    if (!valor) {

      return null;

    }


    const partes =
      valor.split(
        'T'
      );


    if (
      partes.length !== 2
    ) {

      return null;

    }


    const fechaPartes =
      partes[0]
        .split('-')
        .map(
          parte =>
            Number(
              parte
            )
        );


    const horaPartes =
      partes[1]
        .split(':')
        .map(
          parte =>
            Number(
              parte
            )
        );


    if (
      fechaPartes.length !== 3
      ||
      horaPartes.length < 2
    ) {

      return null;

    }


    const year =
      fechaPartes[0];


    const month =
      fechaPartes[1];


    const day =
      fechaPartes[2];


    const hour =
      horaPartes[0];


    const minute =
      horaPartes[1];


    if (
      !Number.isFinite(year)
      ||
      !Number.isFinite(month)
      ||
      !Number.isFinite(day)
      ||
      !Number.isFinite(hour)
      ||
      !Number.isFinite(minute)
    ) {

      return null;

    }


    const iso =
      `${year.toString().padStart(4, '0')}`
      + `-${month.toString().padStart(2, '0')}`
      + `-${day.toString().padStart(2, '0')}`
      + `T${hour.toString().padStart(2, '0')}`
      + `:${minute.toString().padStart(2, '0')}`
      + ':00-06:00';


    const fecha =
      new Date(
        iso
      );


    if (
      Number.isNaN(
        fecha.getTime()
      )
    ) {

      return null;

    }


    return fecha;

  }


  /* =========================================================
     ISO → DATETIME LOCAL
     ========================================================= */

  private convertirIsoADatetimeLocal(
    valor:
      string | null
  ): string {

    if (!valor) {

      return '';

    }


    const fecha =
      new Date(
        valor
      );


    if (
      Number.isNaN(
        fecha.getTime()
      )
    ) {

      return '';

    }


    const partes =
      new Intl.DateTimeFormat(
        'en-CA',
        {

          timeZone:
            'America/Merida',

          year:
            'numeric',

          month:
            '2-digit',

          day:
            '2-digit',

          hour:
            '2-digit',

          minute:
            '2-digit',

          hourCycle:
            'h23'

        }
      )
        .formatToParts(
          fecha
        );


    const year =
      this.obtenerParteFecha(
        partes,
        'year'
      );


    const month =
      this.obtenerParteFecha(
        partes,
        'month'
      );


    const day =
      this.obtenerParteFecha(
        partes,
        'day'
      );


    const hour =
      this.obtenerParteFecha(
        partes,
        'hour'
      );


    const minute =
      this.obtenerParteFecha(
        partes,
        'minute'
      );


    if (
      !year
      ||
      !month
      ||
      !day
      ||
      !hour
      ||
      !minute
    ) {

      return '';

    }


    return (
      `${year}-${month}-${day}`
      + `T${hour}:${minute}`
    );

  }


  /* =========================================================
     PARTE DE FECHA
     ========================================================= */

  private obtenerParteFecha(
    partes:
      Intl.DateTimeFormatPart[],

    tipo:
      string
  ): string {

    const parte =
      partes.find(
        item =>
          item.type ===
          tipo
      );


    return parte?.value
      ?? '';

  }


  /* =========================================================
     SCROLL FORMULARIO
     ========================================================= */

  private irAlFormulario():
    void {

    setTimeout(
      () => {

        const editor =
          document.getElementById(
            'editor-evento'
          );


        if (!editor) {

          return;

        }


        editor.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      },
      50
    );

  }

}