import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DashboardData,
  SecurityAuditData,
  HourlyActivityItem,
} from '@domains/admin/models/dashboard-stats.model';
import { AdminDashboardService } from '@domains/admin/services/admin-dashboard.service';
import { NgIcon } from '@ng-icons/core';
import { forkJoin } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  registerables,
  LinearScale,
  CategoryScale,
  LineController,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { SecondsToTimePipe } from '@shared/pipes/seconds-to-time.pipe';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [NgIcon, CommonModule, BaseChartDirective],
  templateUrl: './admin-dashboard-page.html',
})
export class AdminDashboardPage implements OnInit {
  private dashboardService = inject(AdminDashboardService);

  public isUploadingBoletas = false;
  isLoading: boolean = true;
  hasError: boolean = false;

  public dashboardData: DashboardData | null = null;
  public securityData: SecurityAuditData | null = null;
  public chart!: Chart;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadStats();
  }

  public loadStats(): void {
    this.isLoading = true;
    this.hasError = false;
    this.dashboardData = null;
    this.securityData = null;

    forkJoin({
      mainStats: this.dashboardService.getDashboardStats(),
      securityAudit: this.dashboardService.getSecurityAuditData(),
    }).subscribe({
      next: (results) => {
        this.dashboardData = results.mainStats;
        this.securityData = results.securityAudit;
      },
      error: (err) => {
        this.hasError = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  get normalizedHourlyActivity(): HourlyActivityItem[] {
    const rawActivity = this.dashboardData?.engagement?.hourly_activity;
    if (!rawActivity) {
      return [];
    }

    const activityMap = new Map<number, number>();
    rawActivity.forEach((item) => {
      activityMap.set(item.hour, item.total);
    });

    const normalizedData: HourlyActivityItem[] = [];

    for (let hour = 0; hour <= 23; hour++) {
      normalizedData.push({
        hour: hour,
        total: activityMap.get(hour) || 0,
      });
    }

    return normalizedData;
  }

  get hourlyActivityLabels(): string[] {
    const activity = this.normalizedHourlyActivity;
    if (activity.length === 0) {
      return [];
    }
    return activity.map((item) => `${item.hour.toString().padStart(2, '0')}:00`);
  }

  get hourlyActivityData(): number[] {
    const activity = this.normalizedHourlyActivity;
    if (activity.length === 0) {
      return [];
    }
    return activity.map((item) => item.total);
  }

  get currentHour(): number {
    return new Date().getHours();
  }

  get chartData(): any {
    const data = this.hourlyActivityData;
    const labels = this.hourlyActivityLabels;

    if (data.length === 0) {
      return {
        labels: labels,
        datasets: [],
      };
    }

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          label: 'Acciones de Usuario',
          backgroundColor: 'rgba(255, 193, 7, 0.4)',
          borderColor: '#ffc107',
          pointBackgroundColor: '#e0a800',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#e0a800',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }

  get chartOptions(): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Hora del Día (00:00 - 23:00)',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Número de Acciones',
          },
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
      plugins: {
        legend: { display: false },
      },
    };
  }

  get chartPlugins(): any[] {
    if (!this.securityData) return [];
    const hour = this.currentHour;
    return [
      {
        id: 'timeIndicator',
        afterDraw: (chart: any) => {
          const ctx = chart.ctx;
          const meta = chart.getDatasetMeta(0);

          if (!meta || meta.data.length < 2) return;
          const index = hour;
          if (index >= 0 && index < meta.data.length) {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            const xStart = chart.chartArea.left;
            const currentElement = meta.data[index];
            const nextElement = meta.data[index + 1] || meta.data[meta.data.length - 1];

            let xEnd;
            if (index < meta.data.length - 1) {
              xEnd = (currentElement.x + nextElement.x) / 2;
            } else {
              xEnd = chart.chartArea.right;
            }

            ctx.fillRect(
              xStart,
              chart.chartArea.top,
              xEnd - xStart,
              chart.chartArea.bottom - chart.chartArea.top
            );
            ctx.restore();

            ctx.save();
            ctx.strokeStyle = '#ef4444'; 
            ctx.lineWidth = 2;
            const lineX = currentElement.x;

            ctx.beginPath();
            ctx.moveTo(lineX, chart.chartArea.top);
            ctx.lineTo(lineX, chart.chartArea.bottom);
            ctx.stroke();
            ctx.fillStyle = '#ef4444';
            ctx.textAlign = 'center';
            ctx.fillText('AHORA', lineX, chart.chartArea.top - 10);

            ctx.restore();
          }
        },
      },
    ];
  }
}
