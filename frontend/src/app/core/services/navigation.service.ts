import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { NavNode } from '../models/nav-node.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private apiUrl = `${environment.apiUrl}/nav`;
  private navigationTree$ = new BehaviorSubject<NavNode[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Get complete navigation tree hierarchy
   */
  getNavigationTree(): Observable<NavNode[]> {
    // Return mock data immediately for development
    const mockTree = this.getMockNavigationTree();
    this.navigationTree$.next(mockTree);
    return of(mockTree);
    
    /* Uncomment when backend is ready:
    return this.http.get<ApiResponse<NavNode[]>>(`${this.apiUrl}/tree`).pipe(
      map(response => response.data || []),
      tap(tree => {
        if (tree && tree.length > 0) {
          this.navigationTree$.next(tree);
        } else {
          this.navigationTree$.next(this.getMockNavigationTree());
        }
      }),
      catchError(() => {
        console.warn('Failed to load navigation from API, using mock data');
        const mockTree = this.getMockNavigationTree();
        this.navigationTree$.next(mockTree);
        return of(mockTree);
      })
    );
    */
  }

  /**
   * Get mock navigation tree for development
   */
  private getMockNavigationTree(): NavNode[] {
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
            icon: 'sitemap',
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

  /**
   * Get navigation tree as observable
   */
  get navigationTree(): Observable<NavNode[]> {
    return this.navigationTree$.asObservable();
  }

  /**
   * Expose navigationTree$ as public property for subscribers
   */
  get navNodes$(): BehaviorSubject<NavNode[]> {
    return this.navigationTree$;
  }

  /**
   * Get navigation node by ID
   */
  getNodeById(id: number): Observable<NavNode | null> {
    return this.http.get<ApiResponse<NavNode>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get navigation node by key
   */
  getNodeByKey(nodeKey: string): Observable<NavNode | null> {
    return this.http.get<ApiResponse<NavNode>>(`${this.apiUrl}/key/${nodeKey}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Search navigation nodes by title
   */
  searchNodes(searchTerm: string, nodes: NavNode[]): NavNode[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return nodes;
    }

    const term = searchTerm.toLowerCase().trim();
    const results: NavNode[] = [];

    const search = (nodeList: NavNode[]) => {
      for (const node of nodeList) {
        if (node.title.toLowerCase().includes(term)) {
          results.push(node);
        }
        if (node.children && node.children.length > 0) {
          search(node.children);
        }
      }
    };

    search(nodes);
    return results;
  }

  /**
   * Find node in tree by route URL
   */
  findNodeByRoute(route: string, nodes: NavNode[]): NavNode | null {
    for (const node of nodes) {
      if (node.routeUrl === route) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = this.findNodeByRoute(route, node.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  /**
   * Get breadcrumb trail for a given route
   */
  getBreadcrumbs(route: string, nodes: NavNode[]): NavNode[] {
    const breadcrumbs: NavNode[] = [];
    
    const findPath = (currentNodes: NavNode[], path: NavNode[]): boolean => {
      for (const node of currentNodes) {
        const currentPath = [...path, node];
        
        if (node.routeUrl === route) {
          breadcrumbs.push(...currentPath);
          return true;
        }
        
        if (node.children && node.children.length > 0) {
          if (findPath(node.children, currentPath)) {
            return true;
          }
        }
      }
      return false;
    };

    findPath(nodes, []);
    return breadcrumbs;
  }
}
