import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  horario: string;
  precio: string;
  imagen: string;
  categoria: 'hoy' | 'proximos' | 'pasados';
  cuposLimites?: number;
}

interface EventoEspecial {
  id: number;
  titulo: string;
  subtitulo: string;
  fecha: string;
  descripcion: string;
  imagen: string;
  etiqueta: string;
}

interface InfoHacienda {
  nombre: string;
  subtitulo: string;
  historia: string;
  direccion: string;
  referencia: string;
  telefono: string;
  whatsapp: string;
  email: string;
  horariosAtencion: string;
  mapaEmbedUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  bannerImages: string[] = [
    'assets/b.jpg',
    'assets/b.jpg',
    'assets/b.jpg'
  ];
  currentBannerIndex = 0;
  private bannerInterval: any;

  filtroActual: 'hoy' | 'proximos' | 'pasados' = 'hoy';
  eventosFiltrados: Evento[] = [];
  
  // Índice de la tarjeta enfocada en el centro del carrusel 3D
  activeIndex = 0;

  eventos: Evento[] = [
    {
      id: 1,
      titulo: 'Taller de Cerámica Botánica',
      descripcion: 'Crea tus propias macetas de arcilla decoradas con relieve de hojas reales del jardín.',
      horario: '10:00 AM - 12:00 PM',
      precio: '$250 MXN',
      imagen: 'assets/J.jpg',
      categoria: 'hoy',
      cuposLimites: 4
    },
    {
      id: 2,
      titulo: 'Recorrido Informativo Guiado',
      descripcion: 'Paseo guiado por la hacienda sobre la historia henequenera y sus majestuosos jardines.',
      horario: '04:00 PM - 05:30 PM',
      precio: 'Entrada General ($80 MXN)',
      imagen: 'assets/J.jpg',
      categoria: 'hoy'
    },
    {
      id: 3,
      titulo: 'Cena Yucateca Tradicional',
      descripcion: 'Experiencia gastronómica maya de 3 tiempos en el restaurante principal.',
      horario: '08:00 PM - 10:30 PM',
      precio: '$650 MXN',
      imagen: 'assets/J.jpg',
      categoria: 'hoy',
      cuposLimites: 2
    },
    {
      id: 4,
      titulo: 'Exposición de Orquídeas Exóticas',
      descripcion: 'Muestra especial de especies raras de orquídeas en las terrazas de la hacienda.',
      horario: '11:00 AM - 03:00 PM',
      precio: '$120 MXN',
      imagen: 'assets/J.jpg',
      categoria: 'proximos'
    },
    {
      id: 5,
      titulo: 'Noche de Fotografías Nocturnas',
      descripcion: 'Taller práctico de fotografía de larga exposición recorriendo la arquitectura colonial.',
      horario: '07:00 PM - 09:00 PM',
      precio: '$300 MXN',
      imagen: 'assets/J.jpg',
      categoria: 'pasados'
    }
  ];

  // SECCIÓN DE EVENTOS ESPECIALES & GALAS NOCTURNAS
  eventosEspeciales: EventoEspecial[] = [
    {
      id: 101,
      titulo: 'Noches de Jazz en la Hacienda',
      subtitulo: 'Música en vivo & Coctelería Yucateca',
      fecha: 'Próximo Viernes • 08:00 PM',
      descripcion: 'Disfruta de bandas de jazz en vivo rodeado de la iluminación nocturna de los jardines coloniales y prueba nuestra coctelería artesanal.',
      imagen: 'assets/J.jpg',
      etiqueta: 'Imperdible'
    },
    {
      id: 102,
      titulo: 'Gran Gala Yucateca',
      subtitulo: 'Tradición, Jarana & Gastronomía Maya',
      fecha: '15 de Septiembre • 07:00 PM',
      descripcion: 'Celebración especial con música y jarana en vivo, cata de licores artesanales y una cena maridaje con la mejor cocina tradicional.',
      imagen: 'assets/J.jpg',
      etiqueta: 'Tradicional'
    },
    {
      id: 103,
      titulo: 'Boda Muestra & Expo Eventos',
      subtitulo: 'Montajes Exclusivos & Recorrido por Jardines',
      fecha: 'Edición Especial de Primavera',
      descripcion: 'Conoce nuestras instalaciones, decoración colonial para bodas de ensueño, salones y banquetes gourmet.',
      imagen: 'assets/J.jpg',
      etiqueta: 'Especial'
    }
  ];

  // DATOS REALES DE LA HACIENDA TEYA
  infoHacienda!: InfoHacienda;

  constructor(
    private ngZone: NgZone,
    private sanitizer: DomSanitizer
  ) {
    const rawMapUrl = 'https://maps.google.com/maps?q=Hacienda%20San%20Ildefonso%20Teya&t=&z=15&ie=UTF8&iwloc=&output=embed';
    
    this.infoHacienda = {
      nombre: 'Hacienda San Ildefonso Teya',
      subtitulo: 'Historia, Gastronomía Yucateca & Eventos',
      historia: 'Fundada en 1683, la Hacienda Teya comenzó como una próspera finca ganadera y posteriormente henequenera. Tras años de abandono, fue restaurada en 1974 para convertirse en un referente emblemático del turismo, la cocina tradicional yucateca, el hospedaje boutique y la celebración de eventos inolvidables.',
      direccion: 'Carretera Mérida - Peto Km 12.5, Kanasín, Yucatán',
      referencia: 'A solo 15 minutos del centro de Mérida, rumbo a Cancún/Chetumal.',
      telefono: '+52 (999) 988 0800',
      whatsapp: '+52 (999) 123 4567',
      email: 'ventas@haciendateya.com',
      horariosAtencion: 'Lunes a Domingo: 08:00 AM - 06:00 PM',
      mapaEmbedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(rawMapUrl)
    };
  }

  ngOnInit(): void {
    this.actualizarFiltro();

    this.ngZone.runOutsideAngular(() => {
      this.bannerInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.currentBannerIndex = (this.currentBannerIndex + 1) % this.bannerImages.length;
        });
      }, 5000);
    });
  }

  ngOnDestroy(): void {
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval);
    }
  }

  setFiltro(categoria: 'hoy' | 'proximos' | 'pasados'): void {
    this.filtroActual = categoria;
    this.actualizarFiltro();
  }

  private actualizarFiltro(): void {
    this.eventosFiltrados = this.eventos.filter(evento => evento.categoria === this.filtroActual);
    this.activeIndex = 0;
  }

  // NAVEGACIÓN DEL CARRUSEL 3D
  siguiente(): void {
    if (this.eventosFiltrados.length === 0) return;
    this.activeIndex = (this.activeIndex + 1) % this.eventosFiltrados.length;
  }

  anterior(): void {
    if (this.eventosFiltrados.length === 0) return;
    this.activeIndex = (this.activeIndex - 1 + this.eventosFiltrados.length) % this.eventosFiltrados.length;
  }

  setCardActive(index: number): void {
    this.activeIndex = index;
  }

  getCardClass(index: number): string {
    const total = this.eventosFiltrados.length;
    if (total === 0) return '';

    if (index === this.activeIndex) {
      return 'card-center';
    }

    const prevIndex = (this.activeIndex - 1 + total) % total;
    const nextIndex = (this.activeIndex + 1) % total;

    if (index === prevIndex) {
      return 'card-left';
    } else if (index === nextIndex) {
      return 'card-right';
    }

    return 'card-hidden';
  }

  reservar(evento: Evento): void {
    alert(`Has iniciado la reserva para: ${evento.titulo}`);
  }

  solicitarInformacionEspecial(especial: EventoEspecial): void {
    alert(`Has solicitado información sobre: ${especial.titulo}`);
  }

  abrirComoLlegar(): void {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Hacienda San Ildefonso Teya, Yucatan')}`, '_blank');
  }
}