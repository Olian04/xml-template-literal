import { mergeTemplateSegments } from '../util/mergeTemplateSegments';

export type SegmentStream<T> = ReturnType<typeof mergeTemplateSegments<T>>;
