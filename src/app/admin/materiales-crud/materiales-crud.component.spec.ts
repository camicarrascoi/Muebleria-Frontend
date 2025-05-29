import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesCrudComponent } from './materiales-crud.component';

describe('MaterialesCrudComponent', () => {
  let component: MaterialesCrudComponent;
  let fixture: ComponentFixture<MaterialesCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialesCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
