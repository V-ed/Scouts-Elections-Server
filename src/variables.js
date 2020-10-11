import path from 'path';

// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
export const __dirname = path.dirname(new URL(import.meta.url).pathname);
