import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { inject } from '@angular/core';

@Pipe({
  name: 'relativeDateTime',
  standalone: true,
})
export class RelativeDateTimePipe implements PipeTransform {
  private datePipe = inject(DatePipe);

  transform(value: string | Date | null | undefined, locale: string = 'es'): string {
    if (!value) {
      return 'N/D';
    }

    const date = (value instanceof Date) ? value : new Date(value);
    const now = new Date();
    const timeFormatted = this.datePipe.transform(date, 'shortTime', locale)!;
    
    const diffDays = this.getDifferenceInDays(date, now);

    switch (diffDays) {
      case 0:
        return timeFormatted; 
      case 1:
        return `Ayer a las ${timeFormatted}`; 
      case 2:
        return `Anteayer a las ${timeFormatted}`; 
      default:
        const dateFormat = this.datePipe.transform(date, 'shortDate', locale); 
        return `${dateFormat} a las ${timeFormatted}`;
    }
  }

  private getDifferenceInDays(date1: Date, date2: Date): number {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  }
}