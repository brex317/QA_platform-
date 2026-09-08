import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'primary';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      [ngClass]="getVariantClass()"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
      <span 
        *ngIf="dot"
        [ngClass]="getDotColorClass()"
        class="w-1.5 h-1.5 rounded-full mr-1.5">
      </span>
      {{ label }}
    </span>
  `,
  styles: []
})
export class BadgeComponent {
  @Input() label: string = '';
  @Input() variant: BadgeVariant = 'gray';
  @Input() dot: boolean = false;

  getVariantClass(): string {
    const variantMap: Record<BadgeVariant, string> = {
      success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400'
    };
    return variantMap[this.variant];
  }

  getDotColorClass(): string {
    const dotMap: Record<BadgeVariant, string> = {
      success: 'bg-green-600 dark:bg-green-400',
      warning: 'bg-yellow-600 dark:bg-yellow-400',
      danger: 'bg-red-600 dark:bg-red-400',
      info: 'bg-blue-600 dark:bg-blue-400',
      gray: 'bg-gray-600 dark:bg-gray-400',
      primary: 'bg-primary-600 dark:bg-primary-400'
    };
    return dotMap[this.variant];
  }
}
