import { beforeEach, describe, expect, it } from 'vitest';

import { LocalApi } from './local-api.ts';
import { getSnippetRevisions, restoreSnippetRevision } from './local-api.ts';

const createFile = (content: string) => ({ content });

let counter = 0;

async function createSnippet(content: string) {
  counter += 1;
  return LocalApi.createSnippet({
    files: { 'file.txt': createFile(content) },
    description: `Test snippet ${counter}`,
    isPublic: false,
  });
}

describe('local snippet revisions', () => {
  beforeEach(() => {
    counter = 0;
  });

  it('creates a revision snapshot before each update', async () => {
    const created = await createSnippet('version one');
    await LocalApi.updateSnippet({
      snippetId: created.id,
      files: { 'file.txt': createFile('version two') },
      description: 'Updated description',
    });

    const revisions = await getSnippetRevisions(created.id);

    expect(revisions).toHaveLength(1);
    expect(revisions[0]!.files!['file.txt']?.content).toBe('version one');
    expect(revisions[0]!.description).toBe('Test snippet 1');
  });

  it('returns revisions newest first', async () => {
    const created = await createSnippet('one');
    await LocalApi.updateSnippet({
      snippetId: created.id,
      files: { 'file.txt': createFile('two') },
      description: 'desc two',
    });
    await LocalApi.updateSnippet({
      snippetId: created.id,
      files: { 'file.txt': createFile('three') },
      description: 'desc three',
    });

    const revisions = await getSnippetRevisions(created.id);

    expect(revisions).toHaveLength(2);
    expect(revisions[0]!.files!['file.txt']?.content).toBe('two');
    expect(revisions[1]!.files!['file.txt']?.content).toBe('one');
  });

  it('does not create revisions when updating a missing snippet', async () => {
    await expect(
      LocalApi.updateSnippet({
        snippetId: 'missing-id',
        files: { 'file.txt': createFile('x') },
        description: 'desc',
      })
    ).rejects.toThrow();

    expect(await getSnippetRevisions('missing-id')).toHaveLength(0);
  });

  it('restores files and description from a revision', async () => {
    const created = await createSnippet('one');
    await LocalApi.updateSnippet({
      snippetId: created.id,
      files: { 'file.txt': createFile('two') },
      description: 'desc two',
    });
    await LocalApi.updateSnippet({
      snippetId: created.id,
      files: { 'file.txt': createFile('three') },
      description: 'desc three',
    });

    const revisions = await getSnippetRevisions(created.id);
    const target = revisions[0];

    const restored = await restoreSnippetRevision(created.id, target.id);

    expect(restored.files['file.txt']?.content).toBe('two');
    expect(restored.description).toBe('desc two');

    const after = await LocalApi.getSnippet(created.id);
    expect(after.files['file.txt']?.content).toBe('two');
    expect(after.description).toBe('desc two');

    const allRevisions = await getSnippetRevisions(created.id);
    expect(allRevisions).toHaveLength(3);
    expect(allRevisions[0]!.files!['file.txt']?.content).toBe('three');
  });

  it('throws when restoring a missing revision', async () => {
    const created = await createSnippet('one');

    await expect(restoreSnippetRevision(created.id, 'missing-revision')).rejects.toThrow();
  });

  it('removes revisions when the snippet is deleted', async () => {
    const created = await createSnippet('one');
    await LocalApi.updateSnippet({
      snippetId: created.id,
      files: { 'file.txt': createFile('two') },
      description: 'desc two',
    });

    await LocalApi.deleteSnippet(created.id);

    expect(await getSnippetRevisions(created.id)).toHaveLength(0);
  });
});
