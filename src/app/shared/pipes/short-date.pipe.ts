import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortDate',
  standalone: true 
})
export class ShortDatePipe implements PipeTransform {
  private readonly NULL_MESSAGE = 'Recién ingresó'; 

  transform(value: string | Date | null | undefined): string {
    if (value === null || value === undefined) {
      return this.NULL_MESSAGE;
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',  
      month: 'short', 
      year: 'numeric' 
    };

    const formattedDate = date.toLocaleDateString('es-ES', options);
    return formattedDate.replace(/\./g, '').replace(',', '').trim(); 
  }
}