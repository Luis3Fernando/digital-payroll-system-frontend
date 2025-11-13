import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  private intervals = [
    { label: 'año', seconds: 31536000 },
    { label: 'mes', seconds: 2592000 },
    { label: 'semana', seconds: 604800 },
    { label: 'día', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'minuto', seconds: 60 },
    { label: 'segundo', seconds: 1 },
  ];

  transform(value: string | Date | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 0) {
      return 'En el futuro';
    }
    if (seconds < 60) {
      return 'Hace unos segundos';
    }

    for (const interval of this.intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        if (count === 1) {
          return `Hace 1 ${interval.label}`;
        } else {
          const labelPlural = interval.label.endsWith('s') ? interval.label : interval.label + 's';
          return `Hace ${count} ${labelPlural}`;
        }
      }
    }

    return date.toLocaleDateString();
  }
}
