import Dexie from 'dexie';

interface LocalSnippet {
  id: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  files: Record<string, unknown>;
  starred: boolean;
  stars: number;
}

class GistoDatabase extends Dexie {
  snippets!: Dexie.Table<LocalSnippet>;
  constructor() {
    super('GistoDB');
    this.version(1).stores({
      snippets: 'id, description, isPublic, createdAt, updatedAt, starred',
    });
  }
}

const db = new GistoDatabase();

const LANGUAGES = [
  { name: 'JavaScript', ext: 'js', color: '#f1e05a' },
  { name: 'TypeScript', ext: 'ts', color: '#3178c6' },
  { name: 'Python', ext: 'py', color: '#3572A5' },
  { name: 'Java', ext: 'java', color: '#b07219' },
  { name: 'Go', ext: 'go', color: '#00ADD8' },
  { name: 'Rust', ext: 'rs', color: '#dea584' },
  { name: 'Ruby', ext: 'rb', color: '#701516' },
  { name: 'PHP', ext: 'php', color: '#4F5D95' },
  { name: 'C++', ext: 'cpp', color: '#f34b7d' },
  { name: 'C#', ext: 'cs', color: '#178600' },
  { name: 'HTML', ext: 'html', color: '#e34c26' },
  { name: 'CSS', ext: 'css', color: '#563d7c' },
  { name: 'SQL', ext: 'sql', color: '#e38c00' },
  { name: 'Shell', ext: 'sh', color: '#89e051' },
  { name: 'JSON', ext: 'json', color: '#292929' },
  { name: 'Markdown', ext: 'md', color: '#083fa1' },
  { name: 'YAML', ext: 'yml', color: '#cb171e' },
  { name: 'Dockerfile', ext: 'dockerfile', color: '#384d54' },
  { name: 'Vue', ext: 'vue', color: '#41b883' },
  { name: 'React', ext: 'jsx', color: '#61dafb' },
];

const TAGS = [
  '#api',
  '#backend',
  '#frontend',
  '#database',
  '#config',
  '#utils',
  '#helpers',
  '#auth',
  '#middleware',
  '#testing',
  '#deployment',
  '#devops',
  '#cli',
  '#scripts',
  '#hooks',
  '#components',
  '#styles',
  '#types',
  '#interfaces',
  '#classes',
  '#algorithms',
  '#data-structures',
  '#parsing',
  '#validation',
  '#transform',
];

const CODE_TEMPLATES = [
  `function example() {\n  console.log('Hello, World!');\n  return true;\n}`,
  `const fetchData = async (url) => {\n  const response = await fetch(url);\n  return response.json();\n};`,
  `class Service {\n  constructor() {\n    this.data = [];\n  }\n  \n  add(item) {\n    this.data.push(item);\n  }\n}`,
  `const debounce = (fn, delay) => {\n  let timeoutId;\n  return (...args) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn(...args), delay);\n  };\n};`,
  `export const useStore = () => {\n  const [state, setState] = useState({});\n  return { state, setState };\n};`,
  `const config = {\n  apiUrl: 'https://api.example.com',\n  timeout: 5000,\n  retries: 3,\n};`,
  `interface User {\n  id: string;\n  name: string;\n  email: string;\n  createdAt: Date;\n}`,
  `# Configuration\nport: 3000\nhost: localhost\ndebug: true`,
  `const styles = {\n  display: 'flex',\n  justifyContent: 'center',\n  alignItems: 'center',\n};`,
  `const routes = [\n  { path: '/', component: 'Home' },\n  { path: '/about', component: 'About' },\n];`,
];

const DESCRIPTIONS = [
  'API utility functions for handling requests',
  'React hook for data fetching',
  'Database connection helper',
  'Authentication middleware',
  'Configuration file template',
  'Helper functions for string manipulation',
  'Custom hooks collection',
  'Service worker setup',
  'Error boundary component',
  'Validation utilities',
  'Animation helpers',
  'Form input components',
  'API response types',
  'Constants and enums',
  'Testing utilities',
  'Build scripts',
  'Docker compose configuration',
  'Environment variables template',
  'Logger configuration',
  'Cache implementation',
  'Router setup',
  'State management store',
  'Event emitter class',
  'Date formatting utils',
  'Number formatting helpers',
];

function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  date.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59));
  return date;
}

function generateMockSnippet(): LocalSnippet {
  const lang = randomItem(LANGUAGES);
  const numFiles = randomInt(1, 5);
  const files: Record<string, unknown> = {};

  for (let i = 0; i < numFiles; i++) {
    const fileName = i === 0 ? `main.${lang.ext}` : `module${i}.${lang.ext}`;
    files[fileName] = {
      filename: fileName,
      content: randomItem(CODE_TEMPLATES),
      language: { name: lang.name, color: lang.color },
      encoding: 'text',
      raw_url: '',
      size: randomInt(50, 5000),
      truncated: false,
      type: 'file',
    };
  }

  const numTags = randomInt(0, 3);
  const tags: string[] = [];
  for (let i = 0; i < numTags; i++) {
    const tag = randomItem(TAGS);
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  }

  const description = randomItem(DESCRIPTIONS) + (tags.length > 0 ? ` ${tags.join(' ')}` : '');
  const createdAt = randomDate(365);
  const updatedAt = new Date(createdAt.getTime() + randomInt(0, 30) * 24 * 60 * 60 * 1000);

  return {
    id: `local_${Date.now()}_${randomString(16)}`,
    description,
    isPublic: Math.random() > 0.7,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    files,
    starred: Math.random() > 0.9,
    stars: randomInt(0, 50),
  };
}

export async function generateMockData(count: number = 3000): Promise<void> {
  console.log(`Generating ${count} mock snippets...`);

  const snippets: LocalSnippet[] = [];
  const batchSize = 100;

  for (let i = 0; i < count; i++) {
    snippets.push(generateMockSnippet());

    if (snippets.length >= batchSize) {
      await db.snippets.bulkAdd(snippets);
      console.log(`Added ${i + 1}/${count} snippets...`);
      snippets.length = 0;
    }
  }

  if (snippets.length > 0) {
    await db.snippets.bulkAdd(snippets);
  }

  const total = await db.snippets.count();
  console.log(`Done! Total snippets in database: ${total}`);
}

export async function clearMockData(): Promise<void> {
  const confirmed = window.confirm(
    'Are you sure you want to clear all snippets? This will delete ALL your local snippets permanently!'
  );
  if (!confirmed) {
    console.log('Cancelled.');
    return;
  }
  await db.snippets.clear();
  console.log('Cleared all snippets from database');
}

export async function getSnippetCount(): Promise<number> {
  return await db.snippets.count();
}

export async function generateMockDataWithConfirm(count: number = 3000): Promise<void> {
  const confirmed = window.confirm(
    `This will delete ALL your current snippets and replace them with ${count} mock snippets. Are you sure?`
  );
  if (!confirmed) {
    console.log('Cancelled.');
    return;
  }
  await generateMockData(count);
}
