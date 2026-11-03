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
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  SupabaseService
} from '../../core/services/supabase.service';

import {
  Evento
} from '../../core/models/evento.model';


@Component({
  selector: 'app-reserva-detalle',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],

  templateUrl:
    './reserva-detalle.component.html',

  styleUrl:
    './reserva-detalle.component.css'
})
export class ReservaDetalleComponent
implements OnInit {


  /* =========================================================
     EVENTO
     ========================================================= */

  evento:
    Evento | null = null;


  /* =========================================================
     ESTADOS DE LA PÁGINA
     ========================================================= */

  cargando:
    boolean = true;


  errorCarga:
    boolean = false;


  mostrarFormularioReserva:
    boolean = false;


  enviandoReserva:
    boolean = false;


  reservaEnviada:
    boolean = false;


  errorReserva:
    string = '';


  /* =========================================================
     FORMULARIO
     ========================================================= */

  formularioReserva:
    FormGroup;


  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private supabaseService:
      SupabaseService,

    private formBuilder:
      FormBuilder

  ) {


    this.formularioReserva =
      this.formBuilder.group({

        nombre: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(120)
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.maxLength(200)
          ]
        ],

        telefono: [
          '',
          [
            Validators.required,
            Validators.minLength(7),
            Validators.maxLength(25),
            Validators.pattern(
              /^[0-9+\s()\-]+$/
            )
          ]
        ],

        cantidadPersonas: [
          1,
          [
            Validators.required,
            Validators.min(1)
          ]
        ],

        mensaje: [
          '',
          [
            Validators.maxLength(500)
          ]
        ]

      });

  }


  /* =========================================================
     CICLO DE VIDA
     ========================================================= */

  async ngOnInit():
    Promise<void> {

    const id =
      this.route
        .snapshot
        .paramMap
        .get('id');


    if (!id) {

      await this.router.navigate([
        '/eventos'
      ]);

      return;

    }


    await this.cargarEvento(
      id
    );

  }


  /* =========================================================
     CARGAR EVENTO
     ========================================================= */

  private async cargarEvento(
    id: string
  ): Promise<void> {

    this.cargando =
      true;

    this.errorCarga =
      false;


    try {

      this.evento =
        await this.supabaseService
          .obtenerEventoPorId(
            id
          );


      if (!this.evento) {

        this.errorCarga =
          true;

        return;

      }


      /*
       * Si existe un cupo máximo,
       * también lo aplicamos al formulario.
       */

      if (
        this.evento.cupo_total
      ) {

        const controlCantidad =
          this.formularioReserva
            .get(
              'cantidadPersonas'
            );


        controlCantidad?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(
            this.evento.cupo_total
          )
        ]);


        controlCantidad
          ?.updateValueAndValidity();

      }

    }
    catch (error) {

      console.error(
        'No fue posible cargar el evento:',
        error
      );


      this.evento =
        null;

      this.errorCarga =
        true;

    }
    finally {

      this.cargando =
        false;

    }

  }


  /* =========================================================
     FECHA
     ========================================================= */

  get fechaEvento():
    string {

    if (!this.evento) {

      return '';

    }


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
          this.evento.fecha_inicio
        )
      );

  }


  /* =========================================================
     HORARIO
     ========================================================= */

  get horarioEvento():
    string {

    if (!this.evento) {

      return '';

    }


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
          this.evento.fecha_inicio
        )
      );


    if (
      !this.evento.fecha_fin
    ) {

      return inicio;

    }


    const fin =
      formatter.format(
        new Date(
          this.evento.fecha_fin
        )
      );


    return `${inicio} - ${fin}`;

  }


  /* =========================================================
     PRECIO
     ========================================================= */

  get precioEvento():
    string {

    if (!this.evento) {

      return '';

    }


    if (
      this.evento.precio_texto
    ) {

      return this.evento.precio_texto;

    }


    if (
      this.evento.precio ===
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
          this.evento.moneda,

        minimumFractionDigits:
          0,

        maximumFractionDigits:
          2

      }
    )
      .format(
        this.evento.precio
      );

  }


  /* =========================================================
     ETIQUETA
     ========================================================= */

  get etiquetaEvento():
    string {

    if (!this.evento) {

      return '';

    }


    if (
      this.evento.etiqueta
    ) {

      return this.evento.etiqueta;

    }


    return this.evento.tipo ===
      'especial'
        ? 'Evento especial'
        : 'Experiencia Teya';

  }


  /* =========================================================
     DISPONIBILIDAD
     ========================================================= */

  get eventoDisponibleParaReserva():
    boolean {

    if (!this.evento) {

      return false;

    }


    const fechaLimite =
      this.evento.fecha_fin
        ?? this.evento.fecha_inicio;


    return (
      new Date(
        fechaLimite
      )
      >
      new Date()
    );

  }


  /* =========================================================
     MOSTRAR FORMULARIO + SCROLL AUTOMÁTICO
     ========================================================= */

  continuarReserva():
    void {

    this.mostrarFormularioReserva =
      true;


    this.reservaEnviada =
      false;


    this.errorReserva =
      '';


    /*
     * Esperamos a que Angular renderice
     * el formulario en el DOM.
     *
     * Después desplazamos la página
     * automáticamente hasta la sección.
     */

    setTimeout(
      () => {

        const formulario =
          document.getElementById(
            'form-reserva'
          );


        if (!formulario) {

          return;

        }


        formulario.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });


        /*
         * Después del desplazamiento,
         * colocamos el cursor en
         * Nombre completo.
         */

        setTimeout(
          () => {

            const campoNombre =
              document.getElementById(
                'nombre'
              ) as HTMLInputElement | null;


            campoNombre?.focus();

          },
          600
        );

      },
      50
    );

  }


  /* =========================================================
     ENVIAR RESERVA
     ========================================================= */

  async enviarReserva():
    Promise<void> {

    if (
      !this.evento
      ||
      !this.eventoDisponibleParaReserva
    ) {

      return;

    }


    if (
      this.formularioReserva.invalid
    ) {

      this.formularioReserva
        .markAllAsTouched();

      return;

    }


    this.enviandoReserva =
      true;


    this.errorReserva =
      '';


    try {

      const valores =
        this.formularioReserva
          .getRawValue();


      await this.supabaseService
        .crearReservaSolicitud({

          evento_id:
            this.evento.id,

          nombre:
            valores.nombre.trim(),

          email:
            valores.email
              .trim()
              .toLowerCase(),

          telefono:
            valores.telefono.trim(),

          cantidad_personas:
            Number(
              valores.cantidadPersonas
            ),

          mensaje:
            valores.mensaje?.trim()
              ? valores.mensaje.trim()
              : null

        });


      this.reservaEnviada =
        true;


      this.formularioReserva
        .reset({

          nombre: '',

          email: '',

          telefono: '',

          cantidadPersonas: 1,

          mensaje: ''

        });


      /*
       * Después de registrar correctamente
       * la solicitud, regresamos suavemente
       * al inicio del formulario para que
       * el usuario vea el mensaje de éxito.
       */

      setTimeout(
        () => {

          document
            .getElementById(
              'form-reserva'
            )
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

        },
        50
      );

    }
    catch (error) {

      console.error(
        'No fue posible registrar la reserva:',
        error
      );


      this.errorReserva =
        'No fue posible registrar tu solicitud. Inténtalo nuevamente.';

    }
    finally {

      this.enviandoReserva =
        false;

    }

  }


  /* =========================================================
     VALIDACIÓN
     ========================================================= */

  campoInvalido(
    nombreCampo:
      string
  ): boolean {

    const campo =
      this.formularioReserva
        .get(
          nombreCampo
        );


    return !!(
      campo
      &&
      campo.invalid
      &&
      (
        campo.dirty
        ||
        campo.touched
      )
    );

  }

}