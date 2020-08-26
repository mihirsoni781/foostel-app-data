import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegHostelsComponent } from './reg-hostels.component';

describe('RegHostelsComponent', () => {
  let component: RegHostelsComponent;
  let fixture: ComponentFixture<RegHostelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegHostelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegHostelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
