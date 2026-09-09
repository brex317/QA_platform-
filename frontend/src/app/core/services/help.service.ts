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

  getHelp(nodeKey: string): Observable<HelpResponse> {
    return this.http.get<ApiResponse<HelpResponse>>(`${this.apiUrl}/help`, { params: { nodeKey } })
      .pipe(
        map(r => r.data || { nodeKey, title: 'Quick steps', steps: [] }),
        catchError(err => {
          console.warn(`Failed to load help content for nodeKey ${nodeKey}:`, err);
          return of({ nodeKey, title: 'Quick steps', steps: [] });
        })
      );
  }

  setActiveFieldNodeKey(nodeKey: string | null): void {
    this.activeFieldNodeKeySubject.next(nodeKey);
  }
}
