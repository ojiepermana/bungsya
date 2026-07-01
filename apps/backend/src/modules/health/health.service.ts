import type { HealthResponse } from './health.schema';

/**
 * Business logic for the health check. Trivial today, but the seam is here for
 * real readiness probes later (DB ping, queue depth, …).
 *
 * `abstract class` + `static` = no instance allocation, easy to unit-test.
 */
export abstract class HealthService {
  static check(): HealthResponse {
    return { status: 'ok' };
  }
}
