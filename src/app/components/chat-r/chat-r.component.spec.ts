import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRComponent } from './chat-r.component';

describe('ChatRComponent', () => {
  let component: ChatRComponent;
  let fixture: ComponentFixture<ChatRComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRComponent]
    });
    fixture = TestBed.createComponent(ChatRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
