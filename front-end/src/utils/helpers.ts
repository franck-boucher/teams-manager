import { ZodError } from 'zod';

export const isNumeric = (str: string) => !Number.isNaN(Number(str));

export const getIdFromUrl = (url: string) => {
  const urlParts = url.split('/');
  return Number(urlParts[urlParts.length - 1]);
};

export const strSearch = (str: string, search: string) => {
  return str.toLowerCase().trim().includes(search.toLowerCase().trim());
};

export const multiStrSearch = (strs: string[], search: string) => {
  return strs.some((str) => strSearch(str, search));
};

export const fullName = (user: { firstName: string; lastName: string }) => {
  return `${user.firstName} ${user.lastName}`;
};

export const getFieldZodError = (
  field: string,
  data: { error?: ZodError } | null | undefined,
) => {
  if (data?.error && data.error.errors.length > 0) {
    const fieldError = data.error.errors.find((error) => error.path.includes(field));
    return fieldError?.message;
  }
};
