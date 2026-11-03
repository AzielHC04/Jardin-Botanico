import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  ColeccionBotanica
} from '../../core/models/coleccion-botanica.model';

import {
  JardinService
} from '../../core/services/jardin.service';


@Component({
  selector:
    'app-jardin',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './jardin.component.html',

  styleUrl:
    './jardin.component.css'
})
export class JardinComponent
implements OnInit {


  colecciones:
    ColeccionBotanica[] = [];


  cargando:
    boolean = true;


  errorCarga:
    boolean = false;


  constructor(
    private jardinService:
      JardinService
  ) {}


  async ngOnInit():
    Promise<void> {

    try {

      this.colecciones =
        await this.jardinService
          .obtenerColeccionesActivas();

    }
    catch (error) {

      console.error(
        'No fue posible cargar las colecciones:',
        error
      );


      this.errorCarga =
        true;

    }
    finally {

      this.cargando =
        false;

    }

  }

}