import assert from 'node:assert/strict';
import test from 'node:test';
import { collectUpdates } from '../src/lib/updates.ts';

test('the banner merges recent activity, excludes drafts and keeps unknown dates unknown', () => {
	const posts = [
		{ id: 'revised', data: { title: 'Revised post', description: 'Research', pubDate: new Date('2026-01-01'), updatedDate: new Date('2026-11-25'), image: '/photo.jpeg' } },
		{ id: 'new', data: { title: 'New post', description: 'Writing', pubDate: new Date('2026-11-23') } },
		{ id: 'draft', data: { title: 'Unpublished', pubDate: new Date('2026-12-01'), draft: true } },
	];
	const news = [{ title: 'Model evaluation', text: 'Results', category: 'Evaluation', date: '2026-11-26', link: { label: 'Read results', url: '/results/' } }];
	const projects = [
		{ name: 'New project', tagline: 'A new tool', addedDate: '2026-11-22' },
		{ name: 'Existing project', tagline: 'An existing tool' },
	];
	const certifications = [
		{ name: 'New credential', addedDate: '2026-11-24', url: 'https://example.com/credential' },
		{ name: 'Existing credential' },
	];
	const updates = collectUpdates(posts, news, projects, certifications, 20);
	assert.deepEqual(updates.slice(0, 3).map(item => item.title), ['Model evaluation', 'Revised post', 'New credential']);
	assert(!updates.some(item => item.title === 'Unpublished'));
	assert.equal(updates.find(item => item.title === 'Revised post').image, '/photo.jpeg');
	assert.equal(updates.find(item => item.category === 'Evaluation').url, '/results/');
	assert.equal(updates.find(item => item.title === 'New project').url, '/projects/#project-new-project');
	assert.equal(updates.find(item => item.title === 'Existing credential').url, '/cv/#section-certifications');
	assert.deepEqual(updates.slice(-2).map(item => [item.title, item.date]), [
		['Existing project', undefined], ['Existing credential', undefined],
	]);
	assert.equal(collectUpdates(posts, news, projects, certifications).length, 5);
	assert.deepEqual(collectUpdates([], [], [], []), []);
});
