import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VieweditphotoComponent } from './vieweditphoto.component';

describe('VieweditphotoComponent', () => {
  let component: VieweditphotoComponent;
  let fixture: ComponentFixture<VieweditphotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VieweditphotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VieweditphotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
