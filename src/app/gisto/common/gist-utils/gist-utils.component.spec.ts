import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GistUtilsComponent } from './gist-utils.component';

describe('GistUtilsComponent', () => {
  let component: GistUtilsComponent;
  let fixture: ComponentFixture<GistUtilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GistUtilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GistUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
