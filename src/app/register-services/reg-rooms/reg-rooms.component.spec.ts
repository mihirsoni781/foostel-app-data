import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegRoomsComponent } from './reg-rooms.component';

describe('RegRoomsComponent', () => {
  let component: RegRoomsComponent;
  let fixture: ComponentFixture<RegRoomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegRoomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
