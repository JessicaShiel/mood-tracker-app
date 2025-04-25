import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonRange,
  IonTextarea
} from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-today',
  templateUrl: './today.page.html',
  styleUrls: ['./today.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonItem,
    IonLabel,
    IonIcon,
    IonRange,
    IonTextarea
  ]
})
export class TodayPage implements OnInit {
  
  moodValue: number = 3; // Default mood value (neutral)
  note: string = ''; // Optional note from user
  currentDate: string = new Date().toLocaleString(); // Display current datetime

  ngOnInit() {}

  constructor(
    private storageService: StorageService,
    private alertCtrl: AlertController
  ) {}

  async saveMood() {
    const moodData = {
      mood: this.moodValue,
      note: this.note
    };

    // Format today's date as YYYY-MM-DD
    const dateKey = new Date().toISOString().split('T')[0];

    console.log('Saving mood:', dateKey, moodData);

    // Save to storage
    await this.storageService.saveMood(dateKey, moodData);

    // Show confirmation alert
    const alert = await this.alertCtrl.create({
      header: 'Mood Saved',
      message: 'Your mood has been successfully saved!',
      buttons: ['OK']
    });

    await alert.present();

    // Reset inputs
    this.note = '';
    this.moodValue = 3;
  }
}
