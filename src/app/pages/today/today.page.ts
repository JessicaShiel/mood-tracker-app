import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonIcon, IonRange, IonTextarea } from '@ionic/angular/standalone';

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

  ngOnInit() {
  }

  saveMood() {
    console.log("Save Mood clicked!");
  }

}
