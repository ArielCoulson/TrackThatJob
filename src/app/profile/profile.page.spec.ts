import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule }   from '@angular/forms';
import { Router } from '@angular/router';

import { ProfilePage } from './profile.page';
import { IonicModule } from '@ionic/angular';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule,
        FormsModule
      ],
      providers: [
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate')
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form input', () => {
    const app = fixture.nativeElement;
    const formItems = app.querySelectorAll('ion-input');
    expect(formItems.length).toEqual(2);
  });

  it('should have links to signup and forget password', () => {
    const app = fixture.nativeElement;
    const formItems = app.querySelectorAll('a');
    expect(formItems.length).toEqual(2);
  });
});