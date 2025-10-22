import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  imports: [CommonModule],
  templateUrl: './loading-button.html',
  styles: ``,
})
export class LoadingButton {
  @Input() text: string = 'Enviar';
  @Input() loading: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  get isDisabled(): boolean {
    return this.loading;
  }
}
