import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCaseOrNull',
  standalone: true 
})
export class TitleCaseOrNullPipe implements PipeTransform {
  
  private readonly NULL_MESSAGE = 'No hay usuario registrado'; 

  transform(value: string | null | undefined): string {
    if (value === null || value === undefined || value.trim() === '') {
      return this.NULL_MESSAGE;
    }

    const lowerCaseValue = value.toLowerCase();
    
    return lowerCaseValue.replace(/(^|\s)\S/g, (firstLetter) => {
      return firstLetter.toUpperCase();
    });
  }
}