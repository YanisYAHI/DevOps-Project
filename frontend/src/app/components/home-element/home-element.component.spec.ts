import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeElementComponent } from './home-element.component';

describe('HomeElementComponent', () => {
  let component: HomeElementComponent;
  let fixture: ComponentFixture<HomeElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
