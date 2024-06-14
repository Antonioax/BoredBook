import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html'
})
export class DialogComponent {
  message = input<string>("");
  onClose = output();
}
