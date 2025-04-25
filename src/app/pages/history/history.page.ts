import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Component, OnInit, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonItem, IonIcon, IonToggle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton  } from '@ionic/angular/standalone';
import { ChartType, ChartOptions, ChartConfiguration  } from 'chart.js';
import { StorageService } from 'src/app/services/storage.service';


Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);


@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonIcon,
    IonToggle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ]  
})
export class HistoryPage implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  moods: any[] = [];
  colorMode: 'static' | 'mood' = 'static'; // toggle state
  chartType: ChartType = 'bar';
  timeFilter: 'week' | 'month' = 'month';

  chartLabels: string[] = [];

  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  async ionViewWillEnter() {
    await this.loadMoods();
    this.updateChart();
  }

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    await this.loadMoods();
    this.updateChart();
  }

  async loadMoods() {
    const allMoods = await this.storageService.getAllMoods();
    console.log('All moods from storage:', allMoods);


    // Sort and filter data
    const filtered = allMoods.filter(entry => /^\d{4}-\d{2}-\d{2}$/.test(entry.date));
    const now = new Date();
    this.moods = filtered.filter(entry => {
      const entryDate = new Date(entry.date);
      const daysAgo = (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
      return this.timeFilter === 'week' ? daysAgo <= 7 : daysAgo <= 30;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  updateChart() {
    if (!this.moods.length) return;
    this.chartLabels = this.moods.map(m => m.date);
  
    let backgroundColors: string[] = [];
  
    if (this.colorMode === 'mood') {
      backgroundColors = this.moods.map(m => this.getMoodColor(m.mood));
    } else {
      backgroundColors = this.moods.map(() => '#3880ff');
    }
  
    this.chartData = {
      labels: this.chartLabels,
      datasets: [{
        data: this.moods.map(m => m.mood),
        label: 'Mood Level',
        backgroundColor: backgroundColors
      }]
    };
  

  // Render updated chart
  setTimeout(() => {
    this.chart?.update();
  });

  console.log('Filtered moods for chart:', this.moods);
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

  chartOptions: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    animation: {
      duration: 500,
      easing: 'easeOutQuart'
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const mood = this.moods[index];
            if (!mood) return 'No data';
            const emoji = mood.mood >= 4 ? '😊' : mood.mood === 3 ? '😐' : '😢';
            return `${emoji} Mood: ${mood.mood} - ${mood.note || 'No note'}`;
          }
        }
      },
      legend: {
        display: true
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Mood Level'
        },
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };
  
  
  
  
  
}
