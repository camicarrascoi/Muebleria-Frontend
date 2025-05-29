import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresCrudComponent } from './proveedores-crud.component';

describe('ProveedoresCrudComponent', () => {
  let component: ProveedoresCrudComponent;
  let fixture: ComponentFixture<ProveedoresCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedoresCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedoresCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
