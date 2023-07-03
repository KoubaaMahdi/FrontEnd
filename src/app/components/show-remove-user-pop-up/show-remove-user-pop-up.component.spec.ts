import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRemoveUserPopUpComponent } from './show-remove-user-pop-up.component';

describe('ShowRemoveUserPopUpComponent', () => {
  let component: ShowRemoveUserPopUpComponent;
  let fixture: ComponentFixture<ShowRemoveUserPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowRemoveUserPopUpComponent]
    });
    fixture = TestBed.createComponent(ShowRemoveUserPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
