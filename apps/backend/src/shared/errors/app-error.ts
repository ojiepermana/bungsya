/**
 * Domain error hierarchy. Services throw these; the global error handler
 * (shared/errors/error-handler.ts) maps them to HTTP responses — so services
 * stay free of HTTP/Elysia types.
 */
export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number = 500,
    readonly code: string = 'INTERNAL_SERVER_ERROR',
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 422, 'VALIDATION');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409, 'CONFLICT');
  }
}
