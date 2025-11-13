import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '@domains/auth/models/user.model';
import { SessionService } from '@domains/auth/services/session.service';
import { NgIcon } from '@ng-icons/core';
import { ShortDatePipe } from '@shared/pipes/short-date.pipe';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';
import { TitleCaseOrNullPipe } from '@shared/pipes/title-case-or-null.pipe';

@Component({
  selector: 'app-dashboard-page',
  imports: [NgIcon, RouterModule, CommonModule, ShortDatePipe, TimeAgoPipe, TitleCaseOrNullPipe],
  templateUrl: './dashboard-page.html',
  styles: ``,
})
export class DashboardPage implements OnInit {
  private sessionService = inject(SessionService);

  profile!: User | null;

  ngOnInit(): void {
    this.profile = this.sessionService.getCurrentUser();
  }
}
