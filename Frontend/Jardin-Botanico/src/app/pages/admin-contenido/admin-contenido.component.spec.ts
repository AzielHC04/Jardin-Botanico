import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContenidoComponent } from './admin-contenido.component';

describe('AdminContenidoComponent', () => {
  let component: AdminContenidoComponent;
  let fixture: ComponentFixture<AdminContenidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminContenidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
