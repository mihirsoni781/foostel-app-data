import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodCenterDetailsComponent } from './food-center-details.component';

describe('FoodCenterDetailsComponent', () => {
  let component: FoodCenterDetailsComponent;
  let fixture: ComponentFixture<FoodCenterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodCenterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodCenterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
