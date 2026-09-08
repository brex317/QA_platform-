import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  template?: TemplateRef<any>;
  width?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
  className?: string;
  onClick: (row: any) => void;
  condition?: (row: any) => boolean;
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
        <!-- Table Header -->
        <thead class="bg-gray-50/80 dark:bg-dark-surface">
          <tr>
            <th 
              *ngFor="let column of columns"
              [style.width]="column.width"
              scope="col"
              class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div class="flex items-center gap-2">
                <span>{{ column.label }}</span>
                <button 
                  *ngIf="column.sortable"
                  (click)="onSort(column.key)"
                  class="hover:text-gray-700 dark:hover:text-gray-200">
                  <svg 
                    class="w-4 h-4" 
                    [class.text-primary-600]="sortKey === column.key"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24">
                    <path 
                      *ngIf="sortKey !== column.key"
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    <path 
                      *ngIf="sortKey === column.key && sortDirection === 'asc'"
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 15l7-7 7 7" />
                    <path 
                      *ngIf="sortKey === column.key && sortDirection === 'desc'"
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </th>
            <th 
              *ngIf="actions && actions.length > 0"
              scope="col"
              class="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ACTIONS
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="bg-white dark:bg-dark-bg divide-y divide-gray-100 dark:divide-dark-border">
          <tr 
            *ngFor="let row of data; let i = index"
            class="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors">
            <td 
              *ngFor="let column of columns"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
              
              <!-- Custom Template -->
              <ng-container *ngIf="column.template">
                <ng-container *ngTemplateOutlet="column.template; context: { $implicit: row }"></ng-container>
              </ng-container>

              <!-- Default Content -->
              <ng-container *ngIf="!column.template">
                <!-- Employee Column (Name + Email) -->
                <div *ngIf="column.key === 'fullName' || column.key === 'employee'">
                  <p class="font-bold text-gray-900 dark:text-dark-text">{{ row.fullName || row.employee }}</p>
                  <p class="text-xs text-gray-400 font-normal mt-0.5" *ngIf="row.email">{{ row.email }}</p>
                </div>

                <!-- Status Column -->
                <div *ngIf="column.key === 'status'">
                  <span 
                    [class.bg-sky-100]="row.status === 'ACTIVE'"
                    [class.text-sky-700]="row.status === 'ACTIVE'"
                    [class.bg-yellow-100]="row.status === 'ON_LEAVE'"
                    [class.text-yellow-800]="row.status === 'ON_LEAVE'"
                    [class.bg-gray-100]="row.status === 'INACTIVE'"
                    [class.text-gray-700]="row.status === 'INACTIVE'"
                    class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide inline-block">
                    {{ row.status }}
                  </span>
                </div>

                <!-- Code Column -->
                <span *ngIf="column.key === 'code'" class="font-mono text-xs text-gray-500 dark:text-gray-400">
                  {{ row[column.key] }}
                </span>

                <!-- General Column -->
                <span *ngIf="column.key !== 'fullName' && column.key !== 'employee' && column.key !== 'status' && column.key !== 'code'">
                  {{ row[column.key] }}
                </span>
              </ng-container>
            </td>

            <!-- Actions Dropdown -->
            <td 
              *ngIf="actions && actions.length > 0"
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="relative inline-block text-left">
                <button
                  (click)="toggleActionsMenu(i)"
                  class="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                
                <!-- Floating Action Dropdown Menu -->
                <div 
                  *ngIf="activeActionMenuIndex === i"
                  class="origin-top-right absolute right-0 mt-2 w-52 rounded-xl shadow-xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border py-1.5 z-50 animate-in fade-in duration-150">
                  <button
                    *ngFor="let action of getVisibleActions(row)"
                    (click)="executeAction(action, row, i)"
                    [class]="action.className || 'flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors'">
                    <svg *ngIf="action.icon === 'edit'" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <svg *ngIf="action.icon === 'eye'" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg *ngIf="action.icon === 'copy'" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <svg *ngIf="action.icon === 'delete'" class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>{{ action.label }}</span>
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Loading state -->
      <div 
        *ngIf="isLoading"
        class="flex items-center justify-center py-12 bg-white dark:bg-dark-bg">
        <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Loading...</span>
      </div>

      <!-- Empty state -->
      <div 
        *ngIf="!isLoading && (!data || data.length === 0)"
        class="text-center py-12 bg-white dark:bg-dark-bg">
        <svg 
          class="mx-auto h-12 w-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-dark-text">
          {{ emptyMessage }}
        </h3>
      </div>
    </div>
  `,
  styles: []
})
export class DynamicTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions?: TableAction[];
  @Input() emptyMessage: string = 'No data available';
  @Input() isLoading: boolean = false;
  
  @Output() sort = new EventEmitter<{ key: string; direction: 'asc' | 'desc' }>();

  sortKey: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  activeActionMenuIndex: number | null = null;

  onSort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.sort.emit({ key, direction: this.sortDirection });
  }

  toggleActionsMenu(index: number): void {
    this.activeActionMenuIndex = this.activeActionMenuIndex === index ? null : index;
  }

  getVisibleActions(row: any): TableAction[] {
    if (!this.actions) return [];
    return this.actions.filter(action => 
      !action.condition || action.condition(row)
    );
  }

  executeAction(action: TableAction, row: any, index: number): void {
    action.onClick(row);
    this.activeActionMenuIndex = null;
  }
}
