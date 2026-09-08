import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarComponent],
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

        <!-- Page content -->
        <main class="p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
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
