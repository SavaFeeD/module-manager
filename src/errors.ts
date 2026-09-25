export function describeToken(token: any): string {
  if (token === undefined || token === null) return String(token);
  if (typeof token === 'function') return token.name || '(anonymous class)';
  return String(token);
}

export class ModuleManagerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ProviderNotFoundError extends ModuleManagerError {
  constructor(token: any, moduleName: string | undefined) {
    super(
      `Provider "${describeToken(token)}" is not available in module "${moduleName ?? '(unnamed)'}". ` +
        `Add it to that module's "providers", or import the module that "exports" it.`
    );
  }
}

export class CircularDependencyError extends ModuleManagerError {
  constructor(chain: any[]) {
    super(`Circular dependency detected: ${chain.map(describeToken).join(' -> ')}`);
  }
}

export class CircularImportError extends ModuleManagerError {
  constructor(chain: any[]) {
    super(`Circular module import detected: ${chain.map(describeToken).join(' -> ')}`);
  }
}

export class InvalidFactoryError extends ModuleManagerError {
  constructor(token: any, cause: unknown) {
    super(
      `Factory for provider "${describeToken(token)}" threw an error: ${
        cause instanceof Error ? cause.message : String(cause)
      }`
    );
    this.cause = cause;
  }
}
