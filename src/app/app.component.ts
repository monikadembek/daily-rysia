import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playCircle, imageOutline, logInOutline, powerOutline } from 'ionicons/icons';
import { AuthService } from './auth/auth.service';
import { from } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {
    addIcons({ playCircle, imageOutline, logInOutline, powerOutline });
    from(this.retrieveUserFromStorage()).pipe(takeUntilDestroyed()).subscribe();
  }

  ngOnInit(): void {}

  private async retrieveUserFromStorage() {
    await this.authService.retrieveUserFromStorage();
  }
}
