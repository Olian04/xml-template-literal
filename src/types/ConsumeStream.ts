export type ConsumeStream<T> = {
  next: () => void;
  readonly done: boolean;
  readonly current: T;
};
