import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonIcon, IonRange, IonTextarea } from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-today',
  templateUrl: './today.page.html',
  styleUrls: ['./today.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonLabel, IonIcon, IonRange, IonTextarea]
})

export class TodayPage implements OnInit {

  moodValue: number = 3; // Default mood level (1-5)
  note: string = '';
  currentDate: string = new Date().toLocaleString(); // shows current date/time

  ngOnInit() {}

  constructor(private storageService: StorageService,  private alertCtrl: AlertController) {}
    async saveMood() {
      const moodData = {
        mood: this.moodValue,
        note: this.note
      };

    const dateKey = new Date().toLocaleDateString();
  
    await this.storageService.saveMood(dateKey, moodData);

    const alert = await this.alertCtrl.create({
      header: 'Mood Saved',
      message: 'Your mood has been successfully saved!',
      buttons: ['OK']
    });
  
    await alert.present();
  
    this.note = '';
    this.moodValue = 3;
  
  }
}
