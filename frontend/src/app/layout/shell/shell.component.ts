import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HelpWidgetComponent } from '../../shared/components/help-widget/help-widget.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarComponent, HelpWidgetComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <!-- Sidebar -->
      <app-sidebar
        [isCollapsed]="isSidebarCollapsed"
        (toggle)="toggleSidebar()">
      </app-sidebar>

      <!-- Main content area -->
      <div 
        [class.ml-64]="!isSidebarCollapsed"
        [class.ml-16]="isSidebarCollapsed"
        class="transition-all duration-300">
        
        <!-- Topbar -->
        <app-topbar
          [isSidebarCollapsed]="isSidebarCollapsed"
          (sidebarToggle)="toggleSidebar()">
        </app-topbar>

        <!-- Page content with bottom padding for floating widget clearance -->
        <main class="p-6 pb-24">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Global Floating Contextual Help Widget -->
      <app-help-widget></app-help-widget>
    </div>
  `,
  styles: []
})
export class ShellComponent implements OnInit {
  isSidebarCollapsed = false;

  ngOnInit(): void {
    // Load sidebar state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      this.isSidebarCollapsed = savedState === 'true';
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', this.isSidebarCollapsed.toString());
  }
}
