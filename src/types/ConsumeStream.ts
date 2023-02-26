import { createConsumeStream } from '../util/createConsumeStream';

export type ConsumeStream<T> = ReturnType<typeof createConsumeStream<T>>;
