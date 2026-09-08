import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Backdrop -->
    <div 
      *ngIf="isOpen"
      (click)="onBackdropClick()"
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40">
    </div>

    <!-- Slide-over panel -->
    <div 
      *ngIf="isOpen"
      [ngClass]="getModalSizeClass()"
      class="fixed inset-y-0 right-0 flex max-w-full transition-transform duration-300 z-50">
      <div class="w-screen" [ngClass]="getWidthClass()">
        <div class="flex h-full flex-col bg-white dark:bg-dark-surface shadow-xl">
          <!-- Header -->
          <div class="border-b border-gray-200 dark:border-dark-border px-6 py-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-dark-text">
                {{ title }}
              </h2>
              <button
                (click)="closeModal()"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p *ngIf="description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ description }}
            </p>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-4">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          <div 
            *ngIf="showFooter"
            class="border-t border-gray-200 dark:border-dark-border px-6 py-4">
            <div class="flex justify-end gap-3">
              <button
                *ngIf="showCancelButton"
                (click)="onCancel()"
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                {{ cancelButtonText }}
              </button>
              <button
                *ngIf="showConfirmButton"
                (click)="onConfirm()"
                type="button"
                [disabled]="confirmDisabled"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ confirmButtonText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() description?: string;
  @Input() size: ModalSize = 'md';
  @Input() showFooter: boolean = true;
  @Input() showCancelButton: boolean = true;
  @Input() showConfirmButton: boolean = true;
  @Input() cancelButtonText: string = 'Cancel';
  @Input() confirmButtonText: string = 'Save';
  @Input() confirmDisabled: boolean = false;
  @Input() closeOnBackdropClick: boolean = true;
  
  @Output() close = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  getModalSizeClass(): string {
    return this.isOpen ? 'translate-x-0' : 'translate-x-full';
  }

  getWidthClass(): string {
    const sizeMap: Record<ModalSize, string> = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full'
    };
    return sizeMap[this.size];
  }

  onBackdropClick(): void {
    if (this.closeOnBackdropClick) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  onCancel(): void {
    this.cancel.emit();
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
