import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private messageService = inject(MessageService);

  showSuccess(detail: string, summary: string = 'Succès') {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  showError(detail: string, summary: string = 'Erreur') {
    this.messageService.add({ severity: 'error', summary, detail });
  }

  showInfo(detail: string, summary: string = 'Information') {
    this.messageService.add({ severity: 'info', summary, detail });
  }

  showWarn(detail: string, summary: string = 'Attention') {
    this.messageService.add({ severity: 'warn', summary, detail });
  }

  clear() {
    this.messageService.clear();
  }
}
