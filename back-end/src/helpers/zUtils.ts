import { z } from 'nestjs-zod/z';

export const zNumericString = () =>
  z.preprocess((a) => {
    if (typeof a === 'number') return a;
    if (typeof a === 'string') return parseInt(a);
  }, z.number());
