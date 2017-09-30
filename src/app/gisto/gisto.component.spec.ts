import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GistoComponent } from './gisto.component';

describe('GistoComponent', () => {
  let component: GistoComponent;
  let fixture: ComponentFixture<GistoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GistoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GistoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
