import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciaDetalleComponent } from './experiencia-detalle.component';

describe('ExperienciaDetalleComponent', () => {
  let component: ExperienciaDetalleComponent;
  let fixture: ComponentFixture<ExperienciaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienciaDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienciaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
