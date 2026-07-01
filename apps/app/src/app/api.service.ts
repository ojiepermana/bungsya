import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface HealthResponse {
  status: string;
}

export interface HelloResponse {
  message: string;
}

/**
 * Thin wrapper over HttpClient. The base URL comes from the root .env
 * (API_URL, baked in via scripts/generate-env.ts). It defaults to "" so calls
 * stay relative ("/api/..."), which means:
 *  - in dev, ng serve proxies /api -> http://localhost:3000 (proxy.conf.json)
 *  - in prod, the same Elysia process serves /api alongside the app.
 * Set API_URL to point the SPA at a different API origin.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.base}/api/health`);
  }

  hello(): Observable<HelloResponse> {
    return this.http.get<HelloResponse>(`${this.base}/api/hello`);
  }
}
