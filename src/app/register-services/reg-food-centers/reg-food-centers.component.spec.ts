import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegFoodCentersComponent } from './reg-food-centers.component';

describe('RegFoodCentersComponent', () => {
  let component: RegFoodCentersComponent;
  let fixture: ComponentFixture<RegFoodCentersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegFoodCentersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegFoodCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
