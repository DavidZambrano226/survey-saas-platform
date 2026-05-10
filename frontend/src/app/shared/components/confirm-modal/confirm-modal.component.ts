import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title() }}</h5>
            <button type="button" class="btn-close" (click)="cancel.emit()"></button>
          </div>
          <div class="modal-body">{{ message() }}</div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="cancel.emit()">Cancelar</button>
            <button class="btn btn-danger" (click)="confirm.emit()">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  title   = input('Confirmar');
  message = input('¿Estás seguro?');
  confirm = output();
  cancel  = output();
}
