/**
 * A typed alternative to raw string tokens. The type parameter is phantom
 * (never stored at runtime) - it only exists so `@Inject(token)` and
 * `moduleRef.getProvider(token)` can infer the provider's type instead of `any`.
 *
 * Two tokens are the same provider only if they are the same object reference,
 * so always import the token's value rather than re-creating it.
 */
export class InjectionToken<T> {
  declare readonly __type?: T;

  constructor(public readonly description: string) {}

  toString() {
    return `InjectionToken(${this.description})`;
  }
}
