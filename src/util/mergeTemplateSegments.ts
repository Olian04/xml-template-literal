const isStaticSegment = (v: number) => v % 2 === 0;

export const mergeTemplateSegments = <T>(templateSegments: {
  static: string[];
  dynamic: T[];
}) =>
  new Array(templateSegments.static.length + templateSegments.dynamic.length)
    .fill(0)
    .map((_, i) => {
      if (isStaticSegment(i)) {
        return {
          type: 'static' as const,
          value: templateSegments.static[Math.floor(i / 2)],
        };
      }
      return {
        type: 'dynamic' as const,
        value: templateSegments.dynamic[Math.floor(i / 2)],
      };
    })
    .filter((seg) => Boolean(seg.value));
