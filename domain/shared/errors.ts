export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ParseError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}
