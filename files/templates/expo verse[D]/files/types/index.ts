import { Effect } from 'effect';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EffectReturnSuccessType<T extends (...args: any[]) => Effect.Effect<any, any, any>> = Effect.Effect.Success<ReturnType<T>>;
