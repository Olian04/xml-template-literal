export type SegmentStream<T> = (
  | {
      type: 'static';
      value: string;
    }
  | {
      type: 'dynamic';
      value: T;
    }
)[];
