import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotosManagerPage } from './photos-manager.page';

describe('PhotosManagerPage', () => {
  let component: PhotosManagerPage;
  let fixture: ComponentFixture<PhotosManagerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotosManagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
