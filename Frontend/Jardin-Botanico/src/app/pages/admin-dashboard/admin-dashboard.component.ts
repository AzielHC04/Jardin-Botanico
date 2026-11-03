import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService,
  PerfilAdmin
} from '../../core/services/auth.service';


@Component({
  selector:
    'app-admin-dashboard',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './admin-dashboard.component.html',

  styleUrl:
    './admin-dashboard.component.css'
})
export class AdminDashboardComponent
implements OnInit {


  perfil:
    PerfilAdmin | null = null;


  email:
    string = '';


  cerrandoSesion:
    boolean = false;


  constructor(

    private authService:
      AuthService,

    private router:
      Router

  ) {}


  async ngOnInit():
    Promise<void> {

    const usuario =
      await this.authService
        .obtenerUsuarioActual();


    const perfil =
      await this.authService
        .obtenerPerfilAdminActual();


    this.email =
      usuario?.email
      ?? '';


    this.perfil =
      perfil;

  }


  async cerrarSesion():
    Promise<void> {

    this.cerrandoSesion =
      true;


    try {

      await this.authService
        .cerrarSesion();


      await this.router
        .navigate([
          '/admin/login'
        ]);

    }
    catch (error) {

      console.error(
        'No fue posible cerrar sesión:',
        error
      );

    }
    finally {

      this.cerrandoSesion =
        false;

    }

  }

}