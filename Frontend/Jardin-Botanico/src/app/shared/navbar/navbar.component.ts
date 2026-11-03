import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  SupabaseService
} from '../../core/services/supabase.service';


@Component({
  selector: 'app-navbar',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl:
    './navbar.component.html',

  styleUrl:
    './navbar.component.css'
})
export class NavbarComponent
implements OnInit, OnDestroy {


  menuAbierto:
    boolean = false;


  sesionActiva:
    boolean = false;


  emailUsuario:
    string = '';


  private authSubscription:
    {
      unsubscribe: () => void;
    }
    | undefined;


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     INICIO
     ========================================================= */

  async ngOnInit():
    Promise<void> {

    await this.comprobarSesion();


    const resultado =
      this.supabaseService
        .client
        .auth
        .onAuthStateChange(
          (
            _evento,
            sesion
          ) => {

            this.sesionActiva =
              !!sesion;


            this.emailUsuario =
              sesion
                ?.user
                ?.email
              ?? '';

          }
        );


    this.authSubscription =
      resultado
        .data
        .subscription;

  }


  /* =========================================================
     LIMPIEZA
     ========================================================= */

  ngOnDestroy():
    void {

    this.authSubscription
      ?.unsubscribe();

  }


  /* =========================================================
     SESIÓN
     ========================================================= */

  private async comprobarSesion():
    Promise<void> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .auth
      .getSession();


    if (error) {

      console.error(
        'No fue posible comprobar la sesión:',
        error
      );


      this.sesionActiva =
        false;


      this.emailUsuario =
        '';


      return;

    }


    this.sesionActiva =
      !!data.session;


    this.emailUsuario =
      data.session
        ?.user
        ?.email
      ?? '';

  }


  /* =========================================================
     MENÚ
     ========================================================= */

  alternarMenu():
    void {

    this.menuAbierto =
      !this.menuAbierto;

  }


  cerrarMenu():
    void {

    this.menuAbierto =
      false;

  }


  /* =========================================================
     INICIAL DEL USUARIO
     ========================================================= */

  get inicialUsuario():
    string {

    if (
      !this.emailUsuario
    ) {

      return 'U';

    }


    return this.emailUsuario
      .charAt(0)
      .toUpperCase();

  }

}