import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { HelpResponse } from '../models/help-response.model';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private apiUrl = environment.apiUrl;
  private activeFieldNodeKeySubject = new BehaviorSubject<string | null>(null);
  public activeFieldNodeKey$ = this.activeFieldNodeKeySubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get page-level help steps for a given nodeKey (falls back to parent node if target node has no page help)
   */
  getPageHelp(nodeKey: string): Observable<HelpResponse> {
    return this.http.get<ApiResponse<HelpResponse>>(`${this.apiUrl}/help/page`, { params: { nodeKey } })
      .pipe(
        map(r => r.data || { nodeKey, contextKey: 'page', steps: [] }),
        catchError(err => {
          console.warn(`Failed to load page help content for nodeKey ${nodeKey}:`, err);
          return of({ nodeKey, contextKey: 'page', steps: [] });
        })
      );
  }

  /**
   * Get form-level help steps for a given nodeKey and formContext ('add_form')
   */
  getFormHelp(nodeKey: string, formContext: string = 'add_form'): Observable<HelpResponse> {
    return this.http.get<ApiResponse<HelpResponse>>(`${this.apiUrl}/help/form`, { params: { nodeKey, context: formContext } })
      .pipe(
        map(r => r.data || { nodeKey, contextKey: formContext, steps: [] }),
        catchError(err => {
          console.warn(`Failed to load form help content for nodeKey ${nodeKey}, context ${formContext}:`, err);
          return of({ nodeKey, contextKey: formContext, steps: [] });
        })
      );
  }

  /**
   * Legacy method fallback
   */
  getHelp(nodeKey: string): Observable<HelpResponse> {
    return this.getPageHelp(nodeKey);
  }

  setActiveFieldNodeKey(nodeKey: string | null): void {
    this.activeFieldNodeKeySubject.next(nodeKey);
  }
}
