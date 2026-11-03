import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventoGaleriaComponent } from './admin-evento-galeria.component';

describe('AdminEventoGaleriaComponent', () => {
  let component: AdminEventoGaleriaComponent;
  let fixture: ComponentFixture<AdminEventoGaleriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventoGaleriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEventoGaleriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
