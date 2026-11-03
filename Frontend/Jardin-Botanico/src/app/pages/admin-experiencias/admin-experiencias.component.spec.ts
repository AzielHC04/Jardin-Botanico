import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExperienciasComponent } from './admin-experiencias.component';

describe('AdminExperienciasComponent', () => {
  let component: AdminExperienciasComponent;
  let fixture: ComponentFixture<AdminExperienciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminExperienciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminExperienciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
