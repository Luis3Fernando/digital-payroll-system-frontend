import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AdminDashboardStats } from '@domains/admin/models/dashboard-stats.model';
import { AdminDashboardService } from '@domains/admin/services/admin-dashboard.service';
import { NgIcon } from '@ng-icons/core';
@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [NgIcon, CommonModule],
  templateUrl: './admin-dashboard-page.html',
})
export class AdminDashboardPage implements OnInit {
  private dashboardService = inject(AdminDashboardService);

  isLoading: boolean = true;
  hasError: boolean = false;

  dashboardStats: AdminDashboardStats | null = null;

  ngOnInit(): void {
    this.loadStats();
  }

  public loadStats(): void {
    this.isLoading = true;
    this.hasError = false;
    this.dashboardStats = null;

    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
      },
      error: (err) => {
        this.hasError = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
