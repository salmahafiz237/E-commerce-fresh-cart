import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BenifitBrandComponent } from './benifit-brand.component';

describe('BenifitBrandComponent', () => {
  let component: BenifitBrandComponent;
  let fixture: ComponentFixture<BenifitBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenifitBrandComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BenifitBrandComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
