export const stripTrailingSlash = (string) => string.endsWith('/') ? string.slice(0, -1) : string;
