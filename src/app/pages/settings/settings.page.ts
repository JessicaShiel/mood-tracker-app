import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonContent, IonItem, IonLabel, IonToggle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList } from '@ionic/angular/standalone';
import { Device} from '@capacitor/device';
import { Haptics, ImpactStyle, } from '@capacitor/haptics';
import { App } from '@capacitor/app';
import { IonButton } from '@ionic/angular/standalone';


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
    IonList,
    IonButton
  ]
})

export class SettingsPage implements OnInit {

  appVersion = '';

  deviceInfo: any = {};
  isDarkMode = false;

  async ngOnInit() {
    this.deviceInfo = await Device.getInfo();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode = prefersDark;
    this.setTheme(this.isDarkMode);
    const info = await App.getInfo();
    this.appVersion = info.version;
  }

  toggleDarkMode(event: any) {
    this.setTheme(event.detail.checked);
  }

  private setTheme(enableDark: boolean) {
    if (enableDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
  vibrate() {
    Haptics.impact({ style: ImpactStyle.Heavy });
  }
}

