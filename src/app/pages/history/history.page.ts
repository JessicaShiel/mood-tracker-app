import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonItem, IonIcon, IonToggle } from '@ionic/angular/standalone';
import { ChartType, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSegment, IonSegmentButton, IonLabel, BaseChartDirective, IonItem, IonIcon, IonToggle ]
})
export class HistoryPage implements OnInit {

  moods: any[] = [];
  colorMode: 'static' | 'mood' = 'static'; // toggle state
  chartType: ChartType = 'bar';
  timeFilter: 'week' | 'month' = 'month';

  chartData: any;
  chartLabels: string[] = [];

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    await this.loadMoods();
    this.updateChart();
  }

  async loadMoods() {
    const allMoods = await this.storageService.getAllMoods();

    // Sort and filter data
    const now = new Date();
    this.moods = allMoods.filter(entry => {
      const entryDate = new Date(entry.date);
      const daysAgo = (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
      return this.timeFilter === 'week' ? daysAgo <= 7 : daysAgo <= 30;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  updateChart() {
    this.chartLabels = this.moods.map(m => m.date);

    let backgroundColors: string[] = [];

    if (this.colorMode === 'mood') {
      backgroundColors = this.moods.map(m => this.getMoodColor(m.mood));
    } else {
      backgroundColors = this.moods.map(() => '#3880ff'); // Static blue
    }

    this.chartData = [{
      data: this.moods.map(m => m.mood),
      label: 'Mood Level',
      backgroundColor: backgroundColors
    }];
  }

  getMoodColor(mood: number): string {
    if (mood >= 4) return '#FFD700'; // Happy = Yellow
    if (mood === 3) return '#FFA500'; // Neutral = Orange
    return '#1E90FF'; // Sad = Blue
  }
  
  onColorToggle() {
    this.colorMode = this.colorMode === 'static' ? 'mood' : 'static';
    this.updateChart();
  }

  async onChartTypeChange(type: ChartType) {
    this.chartType = type;
    this.updateChart();
  }

  async onFilterChange(filter: 'week' | 'month') {
    this.timeFilter = filter;
    await this.loadMoods();
    this.updateChart();
  }

  getTooltip(index: number): string {
    const mood = this.moods[index]?.mood;
    const emoji = mood >= 4 ? '😊' : mood === 3 ? '😐' : '😢';
    const note = this.moods[index]?.note;
    return `${emoji} Mood: ${mood}` + (note ? ` - ${note}` : '');
  }

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => this.getTooltip(context.dataIndex)
        }
      }
    }
  };
  
}
