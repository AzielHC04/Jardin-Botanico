import { Component } from '@angular/core';
import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';


interface InfoJardin {
  nombre: string;
  subtitulo: string;
  descripcion: string;

  direccion: string;
  referencia: string;

  telefono: string;
  whatsapp: string;
  email: string;

  horariosAtencion: string;

  mapaEmbedUrl: SafeResourceUrl;
}


@Component({
  selector: 'app-contacto',

  standalone: true,

  imports: [],

  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {

  infoJardin: InfoJardin;


  constructor(
    private sanitizer: DomSanitizer
  ) {

    /* =======================================================
       MAPA EMBEBIDO
       ======================================================= */

    const rawMapUrl =
      'https://maps.google.com/maps?' +
      'q=Jard%C3%ADn%20Bot%C3%A1nico%20de%20Teya%2C%20' +
      'Carretera%20M%C3%A9rida-Canc%C3%BAn%20km%2011.2%2C%20' +
      '97370%20Yucat%C3%A1n' +
      '&t=&z=17&ie=UTF8&iwloc=&output=embed';


    /* =======================================================
       INFORMACIÓN

       IMPORTANTE:
       teléfono, WhatsApp, correo y horarios deben validarse
       con la empresa antes de publicar la versión definitiva.
       ======================================================= */

    this.infoJardin = {

      nombre:
        'Jardín Botánico de Teya',

      subtitulo:
        'Naturaleza, patrimonio & experiencias',

      descripcion:
        'Conoce el Jardín Botánico de Teya y encuentra la información necesaria para planear tu visita.',

      direccion:
        'Carretera Mérida - Cancún Km 11.2, C.P. 97370, Yucatán',

      referencia:
        'Jardín Botánico de Teya, sobre la carretera Mérida - Cancún.',


      // PENDIENTE DE VALIDACIÓN CON LA EMPRESA
      telefono:
        '+52 (999) 988 0800',

      // PENDIENTE DE VALIDACIÓN CON LA EMPRESA
      whatsapp:
        '+52 (999) 123 4567',

      // PENDIENTE DE VALIDACIÓN CON LA EMPRESA
      email:
        'ventas@haciendateya.com',

      // PENDIENTE DE VALIDACIÓN CON LA EMPRESA
      horariosAtencion:
        'Lunes a Domingo: 08:00 AM - 06:00 PM',


      mapaEmbedUrl:
        this.sanitizer
          .bypassSecurityTrustResourceUrl(
            rawMapUrl
          )

    };

  }


  /* =========================================================
     GOOGLE MAPS
     ========================================================= */

  abrirComoLlegar(): void {

    window.open(
      'https://maps.app.goo.gl/rWZDS1EzM5FnLZ7C9',
      '_blank',
      'noopener,noreferrer'
    );

  }

}