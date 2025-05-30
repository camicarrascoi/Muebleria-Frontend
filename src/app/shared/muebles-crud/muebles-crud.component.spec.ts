import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MueblesCrudComponent } from './muebles-crud.component';

describe('MueblesCrudComponent', () => {
  let component: MueblesCrudComponent;
  let fixture: ComponentFixture<MueblesCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MueblesCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MueblesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
