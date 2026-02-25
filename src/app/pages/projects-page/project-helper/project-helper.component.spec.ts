import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHelperComponent } from './project-helper.component';

describe('ProjectHelperComponent', () => {
  let component: ProjectHelperComponent;
  let fixture: ComponentFixture<ProjectHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectHelperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
