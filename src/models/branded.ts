/**
 * Branding pattern: a string with a phantom field that exists only at the type level.
 * At runtime, these are plain strings. At compile, they're distinct types
 */
type Brand<T, B> = T & { readonly __brand: B };

export type UserId = Brand<string, 'UserId'>;
export type TemplateId = Brand<string, 'TemplateId'>;
export type CardInstanceId = Brand<string, 'CardInstanceId'>;
export type PatrolId = Brand<string, 'PatrolId'>;
export type ZoneId = Brand<string, 'ZoneId'>;
export type TransactionId = Brand<string, 'TransactionId'>;

/**
 * Convert raw strings into branded types
 */

export const UserId = (s: string) => s as UserId;
export const TemplateId = (s: string) => s as TemplateId;
export const CardInstanceId = (s: string) => s as CardInstanceId;
export const PatrolId = (s: string) => s as PatrolId;
export const ZoneId = (s: string) => s as ZoneId;
export const TransactionId = (s: string) => s as TransactionId;
