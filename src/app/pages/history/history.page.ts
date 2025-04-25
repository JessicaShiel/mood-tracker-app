import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';
import { IonContent, IonSegment, IonSegmentButton, IonLabel, IonItem, IonIcon, IonToggle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { ChartType, ChartOptions, ChartConfiguration } from 'chart.js';
import { StorageService } from 'src/app/services/storage.service';

// Register chart.js components globally
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

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective; // Reference to chart for manual updates

  moods: any[] = []; // Array to hold mood entries
  colorMode: 'static' | 'mood' = 'static'; // Color mode toggle
  chartType: 'bar' | 'line' = 'bar'; // Current chart type
  timeFilter: 'week' | 'month' = 'month'; // Current time range filter
  chartLabels: string[] = []; // Labels for x-axis

  // Data config for the chart
  chartData: ChartConfiguration<'bar' | 'line'>['data'] = {
    labels: [],
    datasets: []
  };

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    await this.loadMoods();
    this.updateChart();
  }

  async ionViewWillEnter() {
    await this.loadMoods();
    this.updateChart();
  }

  async loadMoods() {
    const allMoods = await this.storageService.getAllMoods();
    console.log('All moods from storage:', allMoods);

    // Filter valid date entries only
    const filtered = allMoods.filter(entry => /^\d{4}-\d{2}-\d{2}$/.test(entry.date));
    const now = new Date();

    // Apply time filter (last week or last month)
    this.moods = filtered.filter(entry => {
      const entryDate = new Date(entry.date);
      const daysAgo = (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
      return this.timeFilter === 'week' ? daysAgo <= 7 : daysAgo <= 30;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort oldest to newest
  }

  updateChart() {
    if (!this.moods.length) return; // Skip if no moods loaded

    this.chartLabels = this.moods.map(m => m.date);

    let backgroundColors: string[] = [];

    if (this.colorMode === 'mood') {
      backgroundColors = this.moods.map(m => this.getMoodColor(m.mood)); // Mood-based coloring
    } else {
      backgroundColors = this.moods.map(() => '#ffb6c1'); // Static pink color
    }

    this.chartData = {
      labels: this.chartLabels,
      datasets: [{
        data: this.moods.map(m => m.mood),
        label: 'Mood Level',
        backgroundColor: backgroundColors
      }]
    };

    // Force chart refresh after small delay
    setTimeout(() => {
      this.chart?.update();
    });

    console.log('Filtered moods for chart:', this.moods);
  }

  // Map mood number to color
  getMoodColor(mood: number): string {
    if (mood >= 4) return '#fff0f5'; // Happy = Lavender Blush
    if (mood === 3) return '#add8e6'; // Neutral = Light Blue
    return '#1E90FF'; // Sad = Blue
  }

  onColorToggle() {
    this.colorMode = this.colorMode === 'static' ? 'mood' : 'static';
    this.updateChart();
  }

  async onChartTypeChange(type: 'bar' | 'line') {
    this.updateChart();
  }

  async onFilterChange(filter: 'week' | 'month') {
    this.timeFilter = filter;
    await this.loadMoods();
    this.updateChart();
  }

  // Build tooltip text manually based on mood and note
  getTooltip(index: number): string {
    const mood = this.moods[index]?.mood;
    const emoji = mood >= 4 ? '😊' : mood === 3 ? '😐' : '😢';
    const note = this.moods[index]?.note;
    return `${emoji} Mood: ${mood}` + (note ? ` - ${note}` : '');
  }

  // Chart.js options
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
