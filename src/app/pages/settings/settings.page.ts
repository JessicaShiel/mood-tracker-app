import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonContent, IonItem, IonLabel, IonToggle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList } from '@ionic/angular/standalone';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonItem,
    IonLabel,
    IonToggle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList
  ]
})
export class SettingsPage implements OnInit {

  deviceInfo: any = {};
  isDarkMode = false;

  async ngOnInit() {
    this.deviceInfo = await Device.getInfo();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode = prefersDark;
    this.setTheme(this.isDarkMode);
  }

  toggleDarkMode(event: any) {
    this.setTheme(event.detail.checked);
  }

  private setTheme(enableDark: boolean) {
    document.body.classList.toggle('dark', enableDark);
  }
}

