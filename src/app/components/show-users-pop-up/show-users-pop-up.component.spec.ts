import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUsersPopUpComponent } from './show-users-pop-up.component';

describe('ShowUsersPopUpComponent', () => {
  let component: ShowUsersPopUpComponent;
  let fixture: ComponentFixture<ShowUsersPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowUsersPopUpComponent]
    });
    fixture = TestBed.createComponent(ShowUsersPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
