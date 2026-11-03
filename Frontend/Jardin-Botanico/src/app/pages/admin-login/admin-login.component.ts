import {
  Component
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
  Router
} from '@angular/router';

import {
  AuthService
} from '../../core/services/auth.service';


@Component({
  selector:
    'app-admin-login',

  standalone:
    true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl:
    './admin-login.component.html',

  styleUrl:
    './admin-login.component.css'
})
export class AdminLoginComponent {


  formulario:
    FormGroup;


  enviando:
    boolean = false;


  errorLogin:
    string = '';


  mostrarPassword:
    boolean = false;


  constructor(

    private formBuilder:
      FormBuilder,

    private authService:
      AuthService,

    private router:
      Router,

    private route:
      ActivatedRoute

  ) {


    this.formulario =
      this.formBuilder.group({

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ]

      });

  }


  /* =========================================================
     LOGIN
     ========================================================= */

  async iniciarSesion():
    Promise<void> {

    if (
      this.formulario.invalid
    ) {

      this.formulario
        .markAllAsTouched();

      return;

    }


    this.enviando =
      true;


    this.errorLogin =
      '';


    try {

      const valores =
        this.formulario
          .getRawValue();


      await this.authService
        .iniciarSesion(

          valores.email
            .trim()
            .toLowerCase(),

          valores.password

        );


      const returnUrl =
        this.route
          .snapshot
          .queryParamMap
          .get(
            'returnUrl'
          );


      await this.router
        .navigateByUrl(
          returnUrl
          || '/admin'
        );

    }
    catch (error) {

      console.error(
        'Inicio de sesión rechazado:',
        error
      );


      this.errorLogin =
        'Correo o contraseña incorrectos.';

    }
    finally {

      this.enviando =
        false;

    }

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


    return !!(
      control
      &&
      control.invalid
      &&
      (
        control.touched
        ||
        control.dirty
      )
    );

  }


  alternarPassword():
    void {

    this.mostrarPassword =
      !this.mostrarPassword;

  }

}