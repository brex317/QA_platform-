import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter, combineLatest } from 'rxjs';
import { NavigationService } from '../../../core/services/navigation.service';
import { HelpService } from '../../../core/services/help.service';
import { NavNode } from '../../../core/models/nav-node.model';
import { HelpResponse } from '../../../core/models/help-response.model';

@Component({
  selector: 'app-help-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Floating Widget Container -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      <!-- Contextual Help Panel Popover -->
      <div 
        *ngIf="isOpen"
        class="mb-3 w-80 sm:w-96 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden transition-all transform duration-200 ease-out pointer-events-auto">
        
        <!-- Header -->
        <div class="px-4 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="font-semibold text-sm tracking-wide text-white truncate max-w-[220px]">
              {{ helpData?.title || 'Quick steps' }}
            </h3>
          </div>
          
          <button 
            (click)="toggleOpen()"
            class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Close help">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 max-h-80 overflow-y-auto">
          <!-- Loading State -->
          <div *ngIf="isLoading" class="flex items-center justify-center py-6 text-gray-500 dark:text-gray-400">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm font-medium">Loading contextual help...</span>
          </div>

          <!-- Content List -->
          <div *ngIf="!isLoading">
            <div *ngIf="helpData && helpData.steps && helpData.steps.length > 0; else noHelp">
              <ul class="space-y-3">
                <li 
                  *ngFor="let step of helpData.steps"
                  class="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-200">
                  <span class="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400 mt-2 flex-shrink-0"></span>
                  <span class="leading-relaxed">{{ step.text }}</span>
                </li>
              </ul>
            </div>

            <!-- Empty / No Help Fallback -->
            <ng-template #noHelp>
              <div class="py-6 text-center text-gray-500 dark:text-gray-400">
                <svg class="w-10 h-10 mx-auto mb-2 text-gray-400 dark:text-gray-500 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p class="text-sm font-medium">No help content available for this page yet.</p>
              </div>
            </ng-template>
          </div>
        </div>

        <!-- Footer indicator -->
        <div *ngIf="currentNodeKey" class="px-4 py-2 bg-gray-50 dark:bg-dark-bg/60 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <span class="truncate">Context: <code class="font-mono text-primary-600 dark:text-primary-400">{{ currentNodeKey }}</code></span>
        </div>
      </div>

      <!-- Main Trigger Button -->
      <button 
        (click)="toggleOpen()"
        class="pointer-events-auto flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="I need help?">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>I need help?</span>
      </button>

    </div>
  `,
  styles: []
})
export class HelpWidgetComponent implements OnInit, OnDestroy {
  isOpen = false;
  isLoading = false;
  helpData: HelpResponse | null = null;
  currentNodeKey: string | null = null;
  
  private activeFieldKey: string | null = null;
  private routeNodeKey: string | null = null;
  private sub = new Subscription();

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private helpService: HelpService
  ) {}

  ngOnInit(): void {
    // 1. Listen to active field focus events
    this.sub.add(
      this.helpService.activeFieldNodeKey$.subscribe(fieldKey => {
        this.activeFieldKey = fieldKey;
        this.resolveAndFetchHelp();
      })
    );

    // 2. Combine Router events & NavNodes loaded to resolve current route nodeKey
    this.sub.add(
      combineLatest([
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
        this.navigationService.navNodes$
      ]).subscribe(([_, nodes]) => {
        this.updateRouteNodeKey(nodes);
      })
    );

    // Initial check on load
    this.sub.add(
      this.navigationService.navNodes$.subscribe(nodes => {
        if (nodes.length > 0 && !this.routeNodeKey) {
          this.updateRouteNodeKey(nodes);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && (!this.helpData || this.currentNodeKey !== this.effectiveNodeKey)) {
      this.resolveAndFetchHelp();
    }
  }

  private updateRouteNodeKey(nodes: NavNode[]): void {
    const url = this.router.url;
    const node = this.navigationService.findNodeByRoute(url, nodes);
    this.routeNodeKey = node ? node.nodeKey : null;
    this.resolveAndFetchHelp();
  }

  private get effectiveNodeKey(): string | null {
    return this.activeFieldKey || this.routeNodeKey || 'dashboard';
  }

  private resolveAndFetchHelp(): void {
    const targetKey = this.effectiveNodeKey;
    if (!targetKey) return;

    if (this.currentNodeKey === targetKey && this.helpData) {
      return; // Already up to date
    }

    this.currentNodeKey = targetKey;
    this.isLoading = true;

    this.helpService.getHelp(targetKey).subscribe({
      next: (data) => {
        this.helpData = data;
        this.isLoading = false;
      },
      error: () => {
        this.helpData = { nodeKey: targetKey, title: 'Quick steps', steps: [] };
        this.isLoading = false;
      }
    });
  }
}
