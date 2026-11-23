import test from 'node:test';
import assert from 'node:assert/strict';
import { publicationConfig } from '../scripts/publish-env.mjs';

test('publication settings derive Pages URLs and reject incomplete or unsafe destinations', () => {
  const values = { GITHUB_USER: 'test-user', GH_TOKEN: 'dummy-test-token', GIT_AUTHOR_NAME: 'Test User', GIT_AUTHOR_EMAIL: 'test@example.org' };
  const root = publicationConfig(values);
  assert.equal(root.REPOSITORY, 'test-user/test-user.github.io');
  assert.equal(root.BASE_PATH, '');
  assert.equal(root.SITE_PUBLIC_URL, 'https://test-user.github.io/');
  const project = publicationConfig({ ...values, GITHUB_REPO: 'personal-site' });
  assert.equal(project.BASE_PATH, '/personal-site');
  assert.equal(project.SITE_PUBLIC_URL, 'https://test-user.github.io/personal-site/');
  assert.throws(() => publicationConfig({ ...values, GH_TOKEN: 'PREENCHA_SEU_TOKEN' }), /GH_TOKEN/);
  assert.throws(() => publicationConfig({ ...values, GITHUB_REPO: '../other' }), /GITHUB_REPO/);
  assert.throws(() => publicationConfig({ ...values, GITHUB_USER: 'other/user' }), /GITHUB_USER/);
  assert.equal(root.GIT_COMMITTER_EMAIL, values.GIT_AUTHOR_EMAIL);
});
