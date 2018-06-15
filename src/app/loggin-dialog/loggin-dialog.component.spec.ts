import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogginDialogComponent } from './loggin-dialog.component';

describe('LogginDialogComponent', () => {
  let component: LogginDialogComponent;
  let fixture: ComponentFixture<LogginDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogginDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
