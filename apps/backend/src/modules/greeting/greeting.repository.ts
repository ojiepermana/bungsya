/**
 * Persistence layer for the greeting demo. In-memory on purpose: the structure
 * is ORM-agnostic, so swap this file for a real database/client later without
 * touching the service or route.
 *
 * Rule: repository does data access only — no business rules, HTTP, or validation.
 */
const templates = {
  default: 'Hello from Elysia 👋',
  named: (name: string) => `Hello, ${name}! 👋`,
} as const;

export abstract class GreetingRepository {
  static defaultGreeting(): string {
    return templates.default;
  }

  static greetingFor(name: string): string {
    return templates.named(name);
  }
}
