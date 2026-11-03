import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoGaleriaPublicaComponent } from './evento-galeria-publica.component';

describe('EventoGaleriaPublicaComponent', () => {
  let component: EventoGaleriaPublicaComponent;
  let fixture: ComponentFixture<EventoGaleriaPublicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventoGaleriaPublicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventoGaleriaPublicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
