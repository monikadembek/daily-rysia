import { Component, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../auth/auth.service';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [IonTabBar, IonTabs, IonTabButton, IonIcon, AsyncPipe],
})
export class TabsComponent implements OnInit {
  isAdmin$ = of(false);
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAdmin$ = this.authService.isAdmin$;
  }
}
