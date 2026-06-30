import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HealthResponse {
  status: string;
}

export interface HelloResponse {
  message: string;
}

/**
 * Thin wrapper over HttpClient. Calls are relative ("/api/..."), so:
 *  - in dev, ng serve proxies /api -> http://localhost:3000 (proxy.conf.json)
 *  - in prod, the same Elysia process serves /api alongside the app.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>('/api/health');
  }

  hello(): Observable<HelloResponse> {
    return this.http.get<HelloResponse>('/api/hello');
  }
}
