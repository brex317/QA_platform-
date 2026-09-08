import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NavNode } from '../../core/models/nav-node.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <aside 
      [class.w-64]="!isCollapsed"
      [class.w-16]="isCollapsed"
      class="fixed left-0 top-0 h-full bg-[#f4f6fa] dark:bg-dark-surface border-r border-gray-200/80 dark:border-dark-border transition-all duration-300 z-40 flex flex-col">
      
      <!-- Top Logo Header -->
      <div 
        class="flex items-center h-16 w-full transition-all border-b border-gray-200/60 dark:border-dark-border"
        [class.px-5]="!isCollapsed"
        [class.justify-center]="isCollapsed"
        [class.px-0]="isCollapsed">
        
        <div class="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0 cursor-pointer hover:bg-blue-700 transition-colors">
          Q
        </div>
        
        <div *ngIf="!isCollapsed" class="ml-3 overflow-hidden whitespace-nowrap">
          <h1 class="text-base font-bold text-gray-900 dark:text-dark-text tracking-tight">QA Platform</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">ERP System</p>
        </div>
      </div>

      <!-- Search Section -->
      <div class="w-full transition-all" [class.px-3]="!isCollapsed" [class.py-3]="!isCollapsed" [class.flex]="isCollapsed" [class.justify-center]="isCollapsed" [class.my-2]="isCollapsed">
        <!-- Expanded Search Box -->
        <div *ngIf="!isCollapsed" class="relative">
          <svg 
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Search menu..."
            class="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm">
        </div>

        <!-- Collapsed Search Icon Box -->
        <div *ngIf="isCollapsed" class="relative group">
          <div class="w-11 h-11 bg-white dark:bg-dark-bg rounded-2xl shadow-sm border border-gray-200/80 dark:border-dark-border flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <!-- Search Hover Tooltip -->
          <div class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            Search menu
            <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800"></div>
          </div>
        </div>
      </div>

      <!-- Navigation Tree -->
      <nav class="flex-1 overflow-y-auto overflow-x-visible w-full custom-scrollbar"
           [class.px-3]="!isCollapsed"
           [class.px-0]="isCollapsed">
        <ul class="space-y-1.5" [class.flex]="isCollapsed" [class.flex-col]="isCollapsed" [class.items-center]="isCollapsed">
          <ng-container *ngFor="let node of filteredNodes">
            <li [class.w-full]="!isCollapsed" [class.flex]="isCollapsed" [class.justify-center]="isCollapsed">
              <ng-container *ngTemplateOutlet="navItem; context: { node: node, level: 0 }"></ng-container>
            </li>
          </ng-container>
        </ul>
      </nav>

      <!-- Bottom Log Out / Sign Out Section -->
      <div class="w-full p-2.5 border-t border-gray-200/60 dark:border-dark-border mt-auto flex justify-center">
        <div class="relative group w-full flex justify-center">
          <button
            (click)="signOut()"
            class="flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-2xl transition-all group"
            [class.w-11]="isCollapsed"
            [class.h-11]="isCollapsed"
            [class.justify-center]="isCollapsed"
            [class.w-full]="!isCollapsed"
            [class.px-3]="!isCollapsed"
            [class.py-2.5]="!isCollapsed"
            [class.gap-3]="!isCollapsed">
            <svg class="w-5 h-5 text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span *ngIf="!isCollapsed" class="whitespace-nowrap font-medium">Log out</span>
          </button>

          <!-- Hover Tooltip for Sign Out in Collapsed Mode -->
          <div 
            *ngIf="isCollapsed" 
            class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            Log out
            <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800"></div>
          </div>
        </div>
      </div>
    </aside>

    <ng-template #navItem let-node="node" let-level="level">
      <div class="relative group" [class.w-full]="!isCollapsed">
        <!-- Direct Route Item -->
        <a
          *ngIf="node.routeUrl"
          [routerLink]="node.routeUrl"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: false }"
          [style.padding-left.rem]="!isCollapsed ? (level * 0.75 + 0.75) : null"
          class="flex items-center transition-all duration-200 group"
          [ngClass]="{
            'w-11 h-11 justify-center rounded-2xl': isCollapsed,
            'w-full px-3 py-2 rounded-xl gap-3': !isCollapsed,
            'bg-blue-100/90 text-blue-700 font-semibold shadow-sm': isCollapsed && isNodeActive(node),
            'text-gray-500 hover:bg-white hover:text-gray-800': isCollapsed && !isNodeActive(node)
          }">
          
          <svg 
            *ngIf="node.icon"
            class="w-5 h-5 flex-shrink-0 transition-colors"
            [ngClass]="{
              'text-blue-700': isCollapsed && isNodeActive(node),
              'text-gray-400 group-hover:text-blue-600': !isCollapsed || !isNodeActive(node)
            }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getIconPath(node.icon)" />
          </svg>
          
          <span *ngIf="!isCollapsed" class="flex-1 whitespace-nowrap overflow-hidden text-ellipsis text-sm font-medium text-gray-700 dark:text-gray-300">{{ node.title }}</span>
        </a>

        <!-- Parent Menu Item with Children -->
        <button
          *ngIf="!node.routeUrl && node.children && node.children.length > 0"
          (click)="toggleNode(node.nodeKey)"
          [style.padding-left.rem]="!isCollapsed ? (level * 0.75 + 0.75) : null"
          class="flex items-center transition-all duration-200 group"
          [ngClass]="{
            'w-11 h-11 justify-center rounded-2xl': isCollapsed,
            'w-full px-3 py-2 rounded-xl gap-3': !isCollapsed,
            'bg-blue-100/90 text-blue-700 font-semibold shadow-sm': isCollapsed && isNodeActive(node),
            'text-gray-500 hover:bg-white hover:text-gray-800': isCollapsed && !isNodeActive(node)
          }">
          
          <svg 
            *ngIf="node.icon"
            class="w-5 h-5 flex-shrink-0 transition-colors"
            [ngClass]="{
              'text-blue-700': isCollapsed && isNodeActive(node),
              'text-gray-400 group-hover:text-blue-600': !isCollapsed || !isNodeActive(node)
            }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getIconPath(node.icon)" />
          </svg>
          
          <span *ngIf="!isCollapsed" class="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis text-sm font-medium text-gray-700 dark:text-gray-300">{{ node.title }}</span>
          
          <svg 
            *ngIf="!isCollapsed"
            class="w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0" 
            [class.rotate-90]="isExpanded(node.nodeKey)"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Tooltip on Hover when Collapsed -->
        <div 
          *ngIf="isCollapsed" 
          class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          {{ node.title }}
          <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800"></div>
        </div>

        <!-- Sub-items tree (Expanded view) -->
        <ul 
          *ngIf="!isCollapsed && node.children && node.children.length > 0 && isExpanded(node.nodeKey)"
          class="mt-1 space-y-1">
          <li *ngFor="let child of node.children">
            <ng-container *ngTemplateOutlet="navItem; context: { node: child, level: level + 1 }"></ng-container>
          </li>
        </ul>
      </div>
    </ng-template>
  `,
  styles: [`
    :host ::ng-deep a.active {
      background-color: rgba(79, 70, 229, 0.1);
      color: #4f46e5;
      font-weight: 600;
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  @Output() toggle = new EventEmitter<void>();

  navigationTree: NavNode[] = [];
  filteredNodes: NavNode[] = [];
  searchQuery = '';
  expandedNodes = new Set<string>();
  currentRoute = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  signOut(): void {
    this.authService.logout();
    window.location.reload();
  }

  isNodeActive(node: NavNode): boolean {
    if (!this.currentRoute) return false;
    if (node.routeUrl && this.currentRoute.startsWith(node.routeUrl)) {
      return true;
    }
    if (node.children && node.children.length > 0) {
      return node.children.some(child => this.isNodeActive(child));
    }
    return false;
  }

  ngOnInit(): void {
    // Initialize with hardcoded navigation structure
    this.navigationTree = this.getNavigationStructure();
    this.filteredNodes = this.navigationTree;
    console.log('Navigation loaded:', this.navigationTree.length, 'items');
    console.log('Filtered nodes:', this.filteredNodes);
    this.expandActiveRoute();

    // Track current route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
        this.expandActiveRoute();
      });
  }

  private getNavigationStructure(): NavNode[] {
    return [
      {
        id: 1,
        nodeKey: 'dashboard',
        parentId: null,
        title: 'Dashboard',
        routeUrl: '/dashboard',
        icon: 'dashboard',
        displayOrder: 1,
        depth: 1,
        isActive: true,
        children: []
      },
      {
        id: 2,
        nodeKey: 'platform',
        parentId: null,
        title: 'Platform',
        routeUrl: null,
        icon: 'cog',
        displayOrder: 2,
        depth: 1,
        isActive: true,
        children: [
          {
            id: 21,
            nodeKey: 'platform.settings',
            parentId: 2,
            title: 'Settings',
            routeUrl: '/platform',
            icon: 'cog',
            displayOrder: 1,
            depth: 2,
            isActive: true,
            children: []
          }
        ]
      },
      {
        id: 3,
        nodeKey: 'hrms',
        parentId: null,
        title: 'HRMS',
        routeUrl: null,
        icon: 'users',
        displayOrder: 3,
        depth: 1,
        isActive: true,
        children: [
          {
            id: 31,
            nodeKey: 'hrms.organization',
            parentId: 3,
            title: 'Organization Structure',
            routeUrl: '/hrms/organization',
            icon: 'briefcase',
            displayOrder: 1,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 32,
            nodeKey: 'hrms.employees',
            parentId: 3,
            title: 'Employee Management',
            routeUrl: '/hrms/employees',
            icon: 'users',
            displayOrder: 2,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 33,
            nodeKey: 'hrms.clearance',
            parentId: 3,
            title: 'Clearance Setting',
            routeUrl: '/hrms/clearance',
            icon: 'check',
            displayOrder: 3,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 34,
            nodeKey: 'hrms.overtime',
            parentId: 3,
            title: 'Overtime Setting',
            routeUrl: '/hrms/overtime',
            icon: 'clock',
            displayOrder: 4,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 35,
            nodeKey: 'hrms.severance',
            parentId: 3,
            title: 'Severance Setting',
            routeUrl: '/hrms/severance',
            icon: 'briefcase',
            displayOrder: 5,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 36,
            nodeKey: 'hrms.termination',
            parentId: 3,
            title: 'Termination',
            routeUrl: '/hrms/termination',
            icon: 'users',
            displayOrder: 6,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 37,
            nodeKey: 'hrms.delegation',
            parentId: 3,
            title: 'Delegation',
            routeUrl: '/hrms/delegation',
            icon: 'users',
            displayOrder: 7,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 38,
            nodeKey: 'hrms.recruitment',
            parentId: 3,
            title: 'Recruitment',
            routeUrl: '/hrms/recruitment',
            icon: 'users',
            displayOrder: 8,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 39,
            nodeKey: 'hrms.promotion',
            parentId: 3,
            title: 'Promotion',
            routeUrl: '/hrms/promotion',
            icon: 'chart',
            displayOrder: 9,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 310,
            nodeKey: 'hrms.performance',
            parentId: 3,
            title: 'Performance',
            routeUrl: '/hrms/performance',
            icon: 'chart',
            displayOrder: 10,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 311,
            nodeKey: 'hrms.workforce_planning',
            parentId: 3,
            title: 'Workforce Planning',
            routeUrl: '/hrms/workforce-planning',
            icon: 'chart',
            displayOrder: 11,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 312,
            nodeKey: 'hrms.inbox',
            parentId: 3,
            title: 'HRMS Inbox',
            routeUrl: '/hrms/inbox',
            icon: 'inbox',
            displayOrder: 12,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 313,
            nodeKey: 'hrms.transfer',
            parentId: 3,
            title: 'Transfer Management',
            routeUrl: '/hrms/transfer',
            icon: 'users',
            displayOrder: 13,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 314,
            nodeKey: 'hrms.leave',
            parentId: 3,
            title: 'Leave Management',
            routeUrl: '/hrms/leave',
            icon: 'calendar',
            displayOrder: 14,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 315,
            nodeKey: 'hrms.attendance',
            parentId: 3,
            title: 'Attendance',
            routeUrl: '/hrms/attendance',
            icon: 'calendar',
            displayOrder: 15,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 316,
            nodeKey: 'hrms.documents',
            parentId: 3,
            title: 'Document Management',
            routeUrl: '/hrms/documents',
            icon: 'folder',
            displayOrder: 16,
            depth: 2,
            isActive: true,
            children: []
          },
          {
            id: 317,
            nodeKey: 'hrms.compensation',
            parentId: 3,
            title: 'Compensation',
            routeUrl: null,
            icon: 'cash',
            displayOrder: 17,
            depth: 2,
            isActive: true,
            children: [
              {
                id: 3171,
                nodeKey: 'hrms.compensation.payroll',
                parentId: 317,
                title: 'Payroll',
                routeUrl: null,
                icon: 'cash',
                displayOrder: 1,
                depth: 3,
                isActive: true,
                children: [
                  {
                    id: 31711,
                    nodeKey: 'hrms.payroll.dashboard',
                    parentId: 3171,
                    title: 'Dashboard',
                    routeUrl: '/hrms/compensation/payroll/dashboard',
                    icon: 'dashboard',
                    displayOrder: 1,
                    depth: 4,
                    isActive: true,
                    children: []
                  },
                  {
                    id: 31712,
                    nodeKey: 'hrms.payroll.allowance_types',
                    parentId: 3171,
                    title: 'Allowance Types',
                    routeUrl: '/hrms/compensation/payroll/allowance-types',
                    icon: 'folder',
                    displayOrder: 2,
                    depth: 4,
                    isActive: true,
                    children: []
                  },
                  {
                    id: 31713,
                    nodeKey: 'hrms.payroll.employee_allowances',
                    parentId: 3171,
                    title: 'Employee Allowances',
                    routeUrl: '/hrms/compensation/payroll/employee-allowances',
                    icon: 'users',
                    displayOrder: 3,
                    depth: 4,
                    isActive: true,
                    children: []
                  },
                  {
                    id: 31714,
                    nodeKey: 'hrms.payroll.payroll_periods',
                    parentId: 3171,
                    title: 'Payroll Periods',
                    routeUrl: '/hrms/compensation/payroll/payroll-periods',
                    icon: 'calendar',
                    displayOrder: 4,
                    depth: 4,
                    isActive: true,
                    children: []
                  },
                  {
                    id: 31715,
                    nodeKey: 'hrms.payroll.tax_schedules',
                    parentId: 3171,
                    title: 'Tax Schedules',
                    routeUrl: '/hrms/compensation/payroll/tax-schedules',
                    icon: 'chart',
                    displayOrder: 5,
                    depth: 4,
                    isActive: true,
                    children: []
                  },
                  {
                    id: 31716,
                    nodeKey: 'hrms.payroll.pension_rules',
                    parentId: 3171,
                    title: 'Pension Rules',
                    routeUrl: '/hrms/compensation/payroll/pension-rules',
                    icon: 'briefcase',
                    displayOrder: 6,
                    depth: 4,
                    isActive: true,
                    children: []
                  },
                  {
                    id: 31717,
                    nodeKey: 'hrms.payroll.payroll_runs',
                    parentId: 3171,
                    title: 'Payroll Runs',
                    routeUrl: '/hrms/compensation/payroll/payroll-runs',
                    icon: 'chart',
                    displayOrder: 7,
                    depth: 4,
                    isActive: true,
                    children: []
                  },
                  {
                    id: 31718,
                    nodeKey: 'hrms.payroll.payroll_journals',
                    parentId: 3171,
                    title: 'Payroll Journals',
                    routeUrl: '/hrms/compensation/payroll/payroll-journals',
                    icon: 'folder',
                    displayOrder: 8,
                    depth: 4,
                    isActive: true,
                    children: []
                  },
                  {
                    id: 31719,
                    nodeKey: 'hrms.payroll.payslips',
                    parentId: 3171,
                    title: 'Payslips',
                    routeUrl: '/hrms/compensation/payroll/payslips',
                    icon: 'folder',
                    displayOrder: 9,
                    depth: 4,
                    isActive: true,
                    children: []
                  },
                  {
                    id: 31720,
                    nodeKey: 'hrms.payroll.reports',
                    parentId: 3171,
                    title: 'Reports',
                    routeUrl: '/hrms/compensation/payroll/reports',
                    icon: 'chart',
                    displayOrder: 10,
                    depth: 4,
                    isActive: true,
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: 318,
            nodeKey: 'hrms.training',
            parentId: 3,
            title: 'Training',
            routeUrl: '/hrms/training',
            icon: 'briefcase',
            displayOrder: 18,
            depth: 2,
            isActive: true,
            children: []
          }
        ]
      },
      {
        id: 4,
        nodeKey: 'platform_inbox',
        parentId: null,
        title: 'Platform Inbox',
        routeUrl: '/platform-inbox',
        icon: 'inbox',
        displayOrder: 4,
        depth: 1,
        isActive: true,
        children: []
      },
      {
        id: 5,
        nodeKey: 'fms',
        parentId: null,
        title: 'FMS',
        routeUrl: '/fms',
        icon: 'cash',
        displayOrder: 5,
        depth: 1,
        isActive: true,
        children: []
      },
      {
        id: 6,
        nodeKey: 'ppms',
        parentId: null,
        title: 'PPMS',
        routeUrl: '/ppms',
        icon: 'briefcase',
        displayOrder: 6,
        depth: 1,
        isActive: true,
        children: []
      },
      {
        id: 7,
        nodeKey: 'reports',
        parentId: null,
        title: 'Reports & Analytics',
        routeUrl: '/reports-analytics',
        icon: 'chart',
        displayOrder: 7,
        depth: 1,
        isActive: true,
        children: []
      },
      {
        id: 8,
        nodeKey: 'tenant',
        parentId: null,
        title: 'Tenant',
        routeUrl: '/tenant',
        icon: 'briefcase',
        displayOrder: 8,
        depth: 1,
        isActive: true,
        children: []
      },
      {
        id: 9,
        nodeKey: 'workflow',
        parentId: null,
        title: 'Workflow',
        routeUrl: '/workflow',
        icon: 'cog',
        displayOrder: 9,
        depth: 1,
        isActive: true,
        children: []
      },
      {
        id: 10,
        nodeKey: 'notification',
        parentId: null,
        title: 'Notification',
        routeUrl: '/notification',
        icon: 'bell',
        displayOrder: 10,
        depth: 1,
        isActive: true,
        children: []
      },
      {
        id: 11,
        nodeKey: 'system',
        parentId: null,
        title: 'System Management',
        routeUrl: '/system-management',
        icon: 'cog',
        displayOrder: 11,
        depth: 1,
        isActive: true,
        children: []
      }
    ];
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredNodes = this.navigationTree;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredNodes = this.filterNodes(this.navigationTree, query);
    
    // Auto-expand all when searching
    if (this.searchQuery.trim()) {
      this.expandAllNodes(this.filteredNodes);
    }
  }

  private filterNodes(nodes: NavNode[], query: string): NavNode[] {
    return nodes
      .map(node => {
        const matchesTitle = node.title.toLowerCase().includes(query);
        const filteredChildren = node.children ? this.filterNodes(node.children, query) : [];
        
        if (matchesTitle || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children
          };
        }
        return null;
      })
      .filter(node => node !== null) as NavNode[];
  }

  private expandAllNodes(nodes: NavNode[]): void {
    nodes.forEach(node => {
      this.expandedNodes.add(node.nodeKey);
      if (node.children) {
        this.expandAllNodes(node.children);
      }
    });
  }

  private expandActiveRoute(): void {
    if (!this.currentRoute || !this.navigationTree.length) return;
    
    const pathSegments = this.currentRoute.split('/').filter(s => s);
    this.expandNodesForPath(this.navigationTree, pathSegments);
  }

  private expandNodesForPath(nodes: NavNode[], pathSegments: string[]): boolean {
    for (const node of nodes) {
      if (node.routeUrl && this.currentRoute.startsWith(node.routeUrl)) {
        this.expandedNodes.add(node.nodeKey);
        return true;
      }
      
      if (node.children && node.children.length > 0) {
        if (this.expandNodesForPath(node.children, pathSegments)) {
          this.expandedNodes.add(node.nodeKey);
          return true;
        }
      }
    }
    return false;
  }

  toggleNode(nodeKey: string): void {
    if (this.expandedNodes.has(nodeKey)) {
      this.expandedNodes.delete(nodeKey);
    } else {
      this.expandedNodes.add(nodeKey);
    }
  }

  isExpanded(nodeKey: string): boolean {
    return this.expandedNodes.has(nodeKey);
  }

  getIconPath(icon: string): string {
    const iconMap: Record<string, string> = {
      'dashboard': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      'briefcase': 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      'chart': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      'cog': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      'inbox': 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
      'bell': 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      'folder': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
    };
    return iconMap[icon] || iconMap['folder'];
  }
}
