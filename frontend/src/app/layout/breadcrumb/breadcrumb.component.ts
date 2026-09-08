import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { NavigationService } from '../../core/services/navigation.service';
import { NavNode } from '../../core/models/nav-node.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      <a 
        routerLink="/"
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </a>

      <ng-container *ngFor="let crumb of breadcrumbs; let last = last">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        
        <a
          *ngIf="!last && crumb.routeUrl"
          [routerLink]="crumb.routeUrl"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
          {{ crumb.title || crumb.name }}
        </a>
        
        <span
          *ngIf="last || !crumb.routeUrl"
          class="text-gray-900 dark:text-dark-text font-medium">
          {{ crumb.title || crumb.name }}
        </span>
      </ng-container>
    </nav>
  `,
  styles: []
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: NavNode[] = [];

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    // Update breadcrumbs on route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    // Initial breadcrumb
    this.updateBreadcrumbs();
  }

  private updateBreadcrumbs(): void {
    const url = this.router.url;
    // Wait for navigation tree to load
    this.navigationService.navNodes$.subscribe((nodes: NavNode[]) => {
      if (nodes.length > 0) {
        this.breadcrumbs = this.navigationService.getBreadcrumbs(url, nodes);
      }
    });
  }
}
