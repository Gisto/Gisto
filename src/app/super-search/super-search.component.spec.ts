import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperSearchComponent } from './super-search.component';

describe('SuperSearchComponent', () => {
  let component: SuperSearchComponent;
  let fixture: ComponentFixture<SuperSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
