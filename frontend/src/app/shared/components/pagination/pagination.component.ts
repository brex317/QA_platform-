import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-4 py-3 sm:px-6">
      <!-- Items per page selector -->
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-700 dark:text-gray-300">Items per page:</label>
        <select 
          [value]="pageSize"
          (change)="onPageSizeChange($event)"
          class="rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text py-1 pl-2 pr-8 text-sm focus:border-primary-500 focus:ring-primary-500">
          <option [value]="10">10</option>
          <option [value]="25">25</option>
          <option [value]="50">50</option>
          <option [value]="100">100</option>
        </select>
      </div>

      <!-- Pagination info and controls -->
      <div class="flex items-center gap-4">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          {{ startItem }} - {{ endItem }} of {{ totalItems }}
        </p>
        
        <div class="flex gap-1">
          <!-- First page -->
          <button
            (click)="goToPage(1)"
            [disabled]="currentPage === 1"
            class="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            ««
          </button>
          
          <!-- Previous page -->
          <button
            (click)="goToPage(currentPage - 1)"
            [disabled]="currentPage === 1"
            class="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            ‹
          </button>
          
          <!-- Page numbers -->
          <button
            *ngFor="let page of visiblePages"
            (click)="goToPage(page)"
            [class.bg-primary-600]="page === currentPage"
            [class.text-white]="page === currentPage"
            [class.border-primary-600]="page === currentPage"
            class="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            {{ page }}
          </button>
          
          <!-- Next page -->
          <button
            (click)="goToPage(currentPage + 1)"
            [disabled]="currentPage === totalPages"
            class="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            ›
          </button>
          
          <!-- Last page -->
          <button
            (click)="goToPage(totalPages)"
            [disabled]="currentPage === totalPages"
            class="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            »»
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() totalItems: number = 0;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startItem(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalItems ? this.totalItems : end;
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newSize = parseInt(select.value, 10);
    this.pageSizeChange.emit(newSize);
  }
}
