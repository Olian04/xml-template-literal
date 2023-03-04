export const enum SegmentType {
  Static = 'Static',
  Dynamic = 'Dynamic',
}

export type SegmentStream<T> = (
  | {
      type: SegmentType.Static;
      value: string;
    }
  | {
      type: SegmentType.Dynamic;
      value: T;
    }
)[];
