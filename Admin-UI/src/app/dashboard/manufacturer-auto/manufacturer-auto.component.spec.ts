import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerAutoComponent } from './manufacturer-auto.component';

describe('ManufacturerAutoComponent', () => {
  let component: ManufacturerAutoComponent;
  let fixture: ComponentFixture<ManufacturerAutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerAutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
