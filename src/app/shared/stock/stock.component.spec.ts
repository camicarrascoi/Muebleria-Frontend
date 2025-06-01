import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockComponent } from './stock.component';
import { CommonModule } from '@angular/common';

describe('StockComponent', () => {
  let component: StockComponent;
  let fixture: ComponentFixture<StockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockComponent, CommonModule]  // Importa standalone + CommonModule
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
