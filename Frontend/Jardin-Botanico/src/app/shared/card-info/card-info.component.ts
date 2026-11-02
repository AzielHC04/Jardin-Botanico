import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TipoVisita {
  id: string;
  titulo: string;
  icono: string;
}

@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-info.component.html',
  styleUrl: './card-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardInfoComponent {

  @Output() tipoSeleccionado = new EventEmitter<string>();

  opcionesVisita: TipoVisita[] = [
    { id: 'individual', titulo: 'Individual', icono: '👤' },
    { id: 'pareja', titulo: 'Pareja', icono: '👥' },
    { id: 'grupo', titulo: 'Grupo', icono: '👨‍👩‍👧‍👦' },
    { id: 'escuela', titulo: 'Escuela', icono: '🏫' }
  ];

  opcionActiva: string = 'individual';

  seleccionarOpcion(id: string): void {
    this.opcionActiva = id;
    this.tipoSeleccionado.emit(id);
  }
}