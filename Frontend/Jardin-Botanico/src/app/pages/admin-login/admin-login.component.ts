import {
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  SupabaseService
} from '../../core/services/supabase.service';


@Component({
  selector: 'app-admin-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl:
    './admin-login.component.html',

  styleUrl:
    './admin-login.component.css'
})
export class AdminLoginComponent {


  email:
    string = '';


  password:
    string = '';


  mostrarPassword:
    boolean = false;


  ingresando:
    boolean = false;


  mensajeError:
    string = '';


  constructor(

    private supabaseService:
      SupabaseService,

    private router:
      Router

  ) {}


  /* =========================================================
     MOSTRAR / OCULTAR CONTRASEÑA
     ========================================================= */

  alternarPassword():
    void {

    this.mostrarPassword =
      !this.mostrarPassword;

  }


  /* =========================================================
     INICIAR SESIÓN
     ========================================================= */

  async iniciarSesion():
    Promise<void> {

    this.mensajeError =
      '';


    const emailLimpio =
      this.email
        .trim();


    if (
      !emailLimpio
      ||
      !this.password
    ) {

      this.mensajeError =
        'Ingresa tu correo electrónico y contraseña.';

      return;

    }


    this.ingresando =
      true;


    try {

      const {
        data,
        error
      } = await this.supabaseService
        .client
        .auth
        .signInWithPassword({

          email:
            emailLimpio,

          password:
            this.password

        });


      if (error) {

        console.error(
          'Error al iniciar sesión:',
          error
        );


        this.mensajeError =
          'El correo electrónico o la contraseña son incorrectos.';

        return;

      }


      if (
        !data.user
      ) {

        this.mensajeError =
          'No fue posible iniciar sesión.';

        return;

      }


      /* =====================================================
         VERIFICAR QUE SEA PERSONAL AUTORIZADO
         ===================================================== */

      const {
        data:
          perfil,

        error:
          perfilError

      } = await this.supabaseService
        .client
        .schema('public')
        .from('perfiles_admin')
        .select(`
          id,
          nombre,
          rol,
          activo
        `)
        .eq(
          'id',
          data.user.id
        )
        .eq(
          'activo',
          true
        )
        .maybeSingle();


      if (
        perfilError
        ||
        !perfil
      ) {

        await this.supabaseService
          .client
          .auth
          .signOut();


        this.mensajeError =
          'Tu cuenta no tiene acceso autorizado al panel administrativo.';

        return;

      }


      await this.router
        .navigate([
          '/admin'
        ]);

    }
    catch (error) {

      console.error(
        'No fue posible iniciar sesión:',
        error
      );


      this.mensajeError =
        'Ocurrió un problema al iniciar sesión. Inténtalo nuevamente.';

    }
    finally {

      this.ingresando =
        false;

    }

  }

}