import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardInfoComponent } from '../../shared/card-info/card-info.component';

@Component({
  selector: 'app-reserva-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardInfoComponent
  ],
  templateUrl: './reserva-detalle.component.html',
  styleUrl: './reserva-detalle.component.css'
})
export class ReservaDetalleComponent implements OnInit {

  eventoId: string = '';
  modalidadVisita: string = 'individual';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventoId = params['id'];
    });
  }

  onModalidadCambiada(tipo: string): void {
    this.modalidadVisita = tipo;
  }
}