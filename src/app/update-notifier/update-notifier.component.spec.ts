import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNotifierComponent } from './update-notifier.component';

describe('UpdateNotifierComponent', () => {
  let component: UpdateNotifierComponent;
  let fixture: ComponentFixture<UpdateNotifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateNotifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateNotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
