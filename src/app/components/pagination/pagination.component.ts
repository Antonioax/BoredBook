import {
  Component,
  Input,
  OnInit,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface EventData {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements OnInit {
  length = input<number>(0);
  pageSize = input<number>(0);
  pageOptions = input<number[]>([]);
  selectedOption = signal<number>(0);
  pageIndex = signal<number>(0);
  previousPageIndex = signal<number>(0);

  totalPages = computed<number>(() => {
    return Math.ceil(this.length() / +this.selectedOption());
  });

  changeOptions = computed<EventData>(() => {
    return {
      length: this.length(),
      pageIndex: this.pageIndex(),
      pageSize: +this.selectedOption(),
      previousPageIndex: this.previousPageIndex(),
    };
  });

  change = output<EventData>();

  ngOnInit() {
    this.selectedOption.set(this.pageSize());
    console.log('Total pages: ' + this.totalPages());
  }

  onChange() {
    this.pageIndex.set(0);
    this.change.emit(this.changeOptions());
  }

  onNext() {
    if (this.pageIndex() + 1 === this.totalPages()) return;
    this.previousPageIndex.set(this.pageIndex());
    this.pageIndex.set(this.pageIndex() + 1);
    this.change.emit(this.changeOptions());
  }

  onBack() {
    if (this.pageIndex() === 0) return;
    this.previousPageIndex.set(this.pageIndex());
    this.pageIndex.set(this.pageIndex() - 1);
    this.change.emit(this.changeOptions());
  }
}
