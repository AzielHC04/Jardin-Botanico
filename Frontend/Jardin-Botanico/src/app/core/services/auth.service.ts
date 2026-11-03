import {
  Injectable
} from '@angular/core';

import {
  User
} from '@supabase/supabase-js';

import {
  SupabaseService
} from './supabase.service';


export interface PerfilAdmin {

  id: string;

  nombre: string;

  rol:
    | 'admin'
    | 'editor';

  activo: boolean;

}


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
     PERFIL ADMINISTRATIVO
     ========================================================= */

  async obtenerPerfilAdminActual():
    Promise<PerfilAdmin | null> {

    const usuario =
      await this.obtenerUsuarioActual();


    if (!usuario) {

      return null;

    }


    const {
      data,
      error
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
        usuario.id
      )
      .eq(
        'activo',
        true
      )
      .maybeSingle();


    if (error) {

      console.error(
        'Error al verificar perfil administrativo:',
        error
      );

      return null;

    }


    return data as PerfilAdmin | null;

  }


  /* =========================================================
     ACCESO ADMIN
     ========================================================= */

  async puedeAccederAdmin():
    Promise<boolean> {

    const perfil =
      await this.obtenerPerfilAdminActual();


    return !!perfil;

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
      .signOut();


    if (error) {

      console.error(
        'Error al cerrar sesión:',
        error
      );

      throw error;

    }

  }

}