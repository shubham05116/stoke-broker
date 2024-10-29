import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StokeTableComponent } from './stoke-table.component';

describe('StokeTableComponent', () => {
  let component: StokeTableComponent;
  let fixture: ComponentFixture<StokeTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StokeTableComponent]
    });
    fixture = TestBed.createComponent(StokeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
