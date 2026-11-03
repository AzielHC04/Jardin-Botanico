import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  AuthService
} from '../../core/services/auth.service';


@Component({
  selector:
    'app-admin-dashboard',

  standalone:
    true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './admin-dashboard.component.html',

  styleUrl:
    './admin-dashboard.component.css'
})
export class AdminDashboardComponent
implements OnInit {


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


    this.email =
      usuario?.email
      ?? '';

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
    finally {

      this.cerrandoSesion =
        false;

    }

  }

}