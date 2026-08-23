import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface EventoGastronomico {
  id: string;
  dia: string;         // Ej: "Viernes 28 de Agosto"
  hora: string;        // Ej: "18:00 hrs"
  titulo: string;
  descripcion: string;
  precio: string;
  lugar: string;
  imagen: string;
  disponible: boolean;
}

@Component({
  selector: 'app-gastronomia',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gastronomia.component.html',
  styleUrl: './gastronomia.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GastronomiaComponent {

  eventosGastronomia: EventoGastronomico[] = [
    {
      id: 'gastro-1',
      dia: 'Jueves 27 de Agosto',
      hora: '17:00 - 19:30 hrs',
      titulo: 'Cata de Infusiones & Hierbas Medicinales',
      descripcion: 'Aprende sobre la recolección sustentable y degusta infusiones artesanales preparadas con plantas medicinales cosechadas directamente en el huerto orgánico del jardín.',
      precio: '$250 MXN',
      lugar: 'Pabellón Botánico',
      imagen: 'assets/gastronomia-infusiones.jpg',
      disponible: true
    },
    {
      id: 'gastro-2',
      dia: 'Viernes 28 de Agosto',
      hora: '18:00 - 21:00 hrs',
      titulo: 'Cena Maridaje: Sabores Silvestres',
      descripcion: 'Una experiencia culinaria de tres tiempos elaborada por chefs locales, integrando flores comestibles, frutos neotropicales y especias de la región peninsular.',
      precio: '$650 MXN',
      lugar: 'Terraza de la Hacienda',
      imagen: 'assets/gastronomia-cena.jpg',
      disponible: true
    },
    {
      id: 'gastro-3',
      dia: 'Sábado 29 de Agosto',
      hora: '11:00 - 14:00 hrs',
      titulo: 'Taller Culinario: Cocina con Flores Comestibles',
      descripcion: 'Clase práctica e interactiva sobre la identificación, propiedades fitoquímicas y preparación de platillos gourmet utilizando orquídeas y flores locales.',
      precio: '$400 MXN',
      lugar: 'Cocina Abierta del Jardín',
      imagen: 'assets/gastronomia-taller.jpg',
      disponible: true
    },
    {
      id: 'gastro-4',
      dia: 'Domingo 30 de Agosto',
      hora: '10:00 - 16:00 hrs',
      titulo: 'Picnic Botánico & Mercado de Productos Orgánicos',
      descripcion: 'Disfruta de una canasta gourmet con mermeladas artesanales, quesos locales y panes de masa madre al aire libre, rodeado de nuestras colecciones botánicas.',
      precio: '$320 MXN',
      lugar: 'Pradera Principal',
      imagen: 'assets/gastronomia-picnic.jpg',
      disponible: true
    }
  ];

}