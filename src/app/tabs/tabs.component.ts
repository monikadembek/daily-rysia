import { Component, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [IonTabBar, IonTabs, IonTabButton, IonIcon],
})
export class TabsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
