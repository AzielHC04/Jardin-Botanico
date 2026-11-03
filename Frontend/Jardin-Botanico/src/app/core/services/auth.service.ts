import {
  Injectable
} from '@angular/core';

import {
  User
} from '@supabase/supabase-js';

import {
  SupabaseService
} from './supabase.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  /* =========================================================
     INICIAR SESIÓN
     ========================================================= */

  async iniciarSesion(
    email: string,
    password: string
  ): Promise<User> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .auth
      .signInWithPassword({

        email,

        password

      });


    if (error) {

      console.error(
        'Error al iniciar sesión:',
        error
      );

      throw error;

    }


    if (!data.user) {

      throw new Error(
        'No fue posible obtener el usuario.'
      );

    }


    return data.user;

  }


  /* =========================================================
     USUARIO ACTUAL
     ========================================================= */

  async obtenerUsuarioActual():
    Promise<User | null> {

    const {
      data,
      error
    } = await this.supabaseService
      .client
      .auth
      .getUser();


    if (error) {

      return null;

    }


    return data.user;

  }


  /* =========================================================
     COMPROBAR AUTENTICACIÓN
     ========================================================= */

  async estaAutenticado():
    Promise<boolean> {

    const usuario =
      await this.obtenerUsuarioActual();


    return !!usuario;

  }


  /* =========================================================
     CERRAR SESIÓN
     ========================================================= */

  async cerrarSesion():
    Promise<void> {

    const {
      error
    } = await this.supabaseService
      .client
      .auth
      .signOut({
        scope: 'local'
      });


    if (error) {

      console.error(
        'Error al cerrar sesión:',
        error
      );

      throw error;

    }

  }

}