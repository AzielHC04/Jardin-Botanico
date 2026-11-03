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
  SupabaseService
} from '../../core/services/supabase.service';

import {
  Experiencia
} from '../../core/models/experiencia.model';


@Component({
  selector:
    'app-experiencias',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './experiencias.component.html',

  styleUrl:
    './experiencias.component.css'
})
export class ExperienciasComponent
implements OnInit {


  experiencias:
    Experiencia[] = [];


  cargando:
    boolean = true;


  errorCarga:
    boolean = false;


  constructor(
    private supabaseService:
      SupabaseService
  ) {}


  async ngOnInit():
    Promise<void> {

    await this.cargarExperiencias();

  }


  private async cargarExperiencias():
    Promise<void> {

    this.cargando =
      true;


    this.errorCarga =
      false;


    try {

      this.experiencias =
        await this.supabaseService
          .obtenerExperienciasActivas();

    }
    catch (error) {

      console.error(
        'No fue posible cargar experiencias:',
        error
      );


      this.experiencias =
        [];


      this.errorCarga =
        true;

    }
    finally {

      this.cargando =
        false;

    }

  }

}