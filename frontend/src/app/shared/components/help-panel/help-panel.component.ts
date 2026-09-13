import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpService } from '../../../core/services/help.service';
import { HelpResponse, HelpStep } from '../../../core/models/help-response.model';

@Component({
  selector: 'app-help-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/40 rounded-xl p-4 transition-all">
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2 text-blue-900 dark:text-blue-200">
          <div class="p-1.5 bg-blue-600 text-white rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 class="font-semibold text-sm tracking-wide">
            {{ title || defaultTitle }}
          </h4>
        </div>
        <span *ngIf="helpData?.contextKey" class="px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
          {{ helpData?.contextKey }}
        </span>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex items-center gap-3 py-3 text-sm text-gray-500 dark:text-gray-400">
        <svg class="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading help steps...</span>
      </div>

      <!-- Steps Content -->
      <div *ngIf="!isLoading">
        <div *ngIf="steps && steps.length > 0; else noSteps">
          <ol class="space-y-2.5">
            <li 
              *ngFor="let step of steps"
              class="flex items-start gap-3 text-xs text-gray-700 dark:text-gray-200">
              <span class="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shadow-sm">
                {{ getStepNumber(step) }}
              </span>
              <span class="leading-relaxed mt-0.5 font-normal">{{ getStepText(step) }}</span>
            </li>
          </ol>
        </div>

        <!-- Empty State -->
        <ng-template #noSteps>
          <p class="text-xs text-gray-500 dark:text-gray-400 italic py-1">
            No specific help steps configured for this feature.
          </p>
        </ng-template>
      </div>
    </div>
  `,
  styles: []
})
export class HelpPanelComponent implements OnInit, OnChanges {
  @Input() nodeKey!: string;
  @Input() formContext?: string;
  @Input() title?: string;

  isLoading = false;
  helpData: HelpResponse | null = null;

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.loadHelp();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['nodeKey'] && !changes['nodeKey'].firstChange) ||
        (changes['formContext'] && !changes['formContext'].firstChange)) {
      this.loadHelp();
    }
  }

  get defaultTitle(): string {
    return this.formContext ? 'Form Instructions' : 'Feature Guidance';
  }

  get steps(): HelpStep[] {
    return this.helpData?.steps || [];
  }

  getStepNumber(step: HelpStep): number {
    return step.stepNumber || step.number || 1;
  }

  getStepText(step: HelpStep): string {
    return step.stepText || step.text || '';
  }

  private loadHelp(): void {
    if (!this.nodeKey) return;

    this.isLoading = true;

    const req$ = this.formContext
      ? this.helpService.getFormHelp(this.nodeKey, this.formContext)
      : this.helpService.getPageHelp(this.nodeKey);

    req$.subscribe({
      next: (data) => {
        this.helpData = data;
        this.isLoading = false;
      },
      error: () => {
        this.helpData = { nodeKey: this.nodeKey, contextKey: this.formContext || 'page', steps: [] };
        this.isLoading = false;
      }
    });
  }
}
