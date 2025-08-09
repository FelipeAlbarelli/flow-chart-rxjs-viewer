import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowCanva } from './flow-canva';

describe('FlowCanva', () => {
  let component: FlowCanva;
  let fixture: ComponentFixture<FlowCanva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowCanva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowCanva);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
