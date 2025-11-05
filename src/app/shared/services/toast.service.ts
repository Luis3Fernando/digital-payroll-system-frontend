import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '@core/models/api-response.model';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastr = inject(ToastrService);

  public show(type: ToastType, title: string, message: string): void {
    switch (type) {
      case 'success':
        this.toastr.success(message, title);
        break;
      case 'error':
        this.toastr.error(message, title);
        break;
      case 'warning':
        this.toastr.warning(message, title);
        break;
      case 'info':
        this.toastr.info(message, title);
        break;
      default:
        this.toastr.info(message, title);
        break;
    }
  }

  public processApiResponse<T>(
    response: ApiResponse<T>,
    defaultTitle: string = 'Notificación'
  ): void {
    const type = response.status as ToastType;
    const messages = response.messages;

    if (messages && messages.length > 0) {
      messages.forEach((msg) => {
        this.show(type, defaultTitle, msg);
      });
    } else {
      this.show(type, defaultTitle, `Operación realizada con éxito.`);
    }
  }
}
