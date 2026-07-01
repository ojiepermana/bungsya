import type { GreetingResponse } from './greeting.schema';
import { GreetingRepository } from './greeting.repository';

/**
 * Business logic for greetings: decide which message to build. Calls the
 * repository for data; never touches HTTP. The route calls this — nothing
 * calls the repository directly except this service.
 */
export abstract class GreetingService {
  static greet(name?: string): GreetingResponse {
    const trimmed = name?.trim();
    const message = trimmed
      ? GreetingRepository.greetingFor(trimmed)
      : GreetingRepository.defaultGreeting();

    return { message };
  }
}
