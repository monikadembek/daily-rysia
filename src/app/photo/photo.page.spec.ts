import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoPage } from './photo.page';

describe('PhotoPage', () => {
  let component: PhotoPage;
  let fixture: ComponentFixture<PhotoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
