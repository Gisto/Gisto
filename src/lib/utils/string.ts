export const upperCaseFirst = (text: string) => {
  const str = text.toLowerCase();
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};

export const camelToTitleCase = (text: string) =>
  text
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();

export const snakeToTitleCase = (text: string) =>
  upperCaseFirst(text.replace(/[_-]/g, ' ').trim().toLowerCase());

export const randomString = (charsCount = 5) =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .slice(0, charsCount);
