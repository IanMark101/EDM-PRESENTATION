import assert from 'node:assert/strict';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
const mode = process.argv[2] || 'build';
assert.ok(['build', 'lint'].includes(mode), 'Use build or lint.');
async function walk(directory) {
  const results = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await walk(path));
    else results.push(path);
  }
  return results;
}
const files = [...await walk(output), ...await walk(join(root, 'scripts'))];
let scripts = 0;
for (const path of files.filter(path => ['.js', '.mjs'].includes(extname(path)))) {
  const checked = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8', windowsHide: true });
  assert.equal(checked.status, 0, `JavaScript syntax failed: ${path}\n${checked.stderr}`);
  scripts++;
}
for (const name of ['package.json', 'vercel.json']) JSON.parse(await readFile(join(root, name), 'utf8'));
for (const path of files.filter(path => ['.js', '.mjs', '.css', '.html'].includes(extname(path)))) {
  const text = await readFile(path, 'utf8');
  assert.ok(!/[ \t]+$/m.test(text), `Trailing whitespace: ${path}`);
  assert.ok(!text.includes('\u0000'), `Unexpected NUL: ${path}`);
}
const html = await readFile(join(output, 'index.html'), 'utf8');
assert.ok(/<html lang="en">/.test(html), 'Document language is required.');
assert.ok(!/\son[a-z]+\s*=/i.test(html), 'Use registered handlers instead of inline event handlers.');
assert.ok(/name="viewport"/.test(html), 'Responsive viewport is required.');
const css = await readFile(join(output, 'styles.css'), 'utf8');
const strippedCSS = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(['"])(?:\\.|(?!\1)[^\\])*?\1/g, '');
assert.equal((strippedCSS.match(/{/g) || []).length, (strippedCSS.match(/}/g) || []).length, 'CSS braces must balance.');
assert.ok(css.includes('prefers-reduced-motion') && css.includes('@media print'), 'Reduced-motion and print rules are required.');
console.log(`Lint passed: ${scripts} JavaScript files, JSON configuration, HTML and CSS checks.`);
if (mode === 'lint') process.exit(0);

const context = vm.createContext({ window: {} });
vm.runInContext(await readFile(join(output, 'icons.js'), 'utf8'), context, { timeout: 3000 });
vm.runInContext(await readFile(join(output, 'slides.js'), 'utf8'), context, { timeout: 3000 });
const deck = context.window.CARE_DECK;
assert.equal(deck.length, 26, 'The agreed storyboard has 26 slides.');
assert.equal(new Set(deck.map(slide => slide.id)).size, deck.length, 'Slide IDs must be unique.');
assert.equal(new Set(deck.map(slide => slide.chapter)).size, 4, 'Expected four narrative chapters.');
const required = ['the-problem', 'registration', 'check-in', 'consultation', 'laboratory', 'doctor-follow-up', 'billing', 'complete-workflow', 'governance', 'data-quality', 'integration', 'etl', 'etl-example', 'alignment', 'scope'];
for (const id of required) assert.ok(deck.some(slide => slide.id === id), `Missing topic: ${id}`);
const renderedSlides = [];
for (const slide of deck) {
  assert.ok(/^[a-z]+(?:-[a-z]+)*$/.test(slide.id), `Invalid slide ID: ${slide.id}`);
  assert.ok(slide.title && slide.evidence && slide.notes.length >= 2, `Missing content or notes: ${slide.id}`);
  for (const state of [{}, { pillar: 'governance', lab: 'complete', match: 'safe', etl: 'load', loaded: true }]) {
    const rendered = slide.render(state);
    renderedSlides.push(rendered);
    assert.ok(typeof rendered === 'string' && rendered.length > 200, `Empty slide: ${slide.id}`);
    assert.ok(!/undefined|\[object Object\]|\u2014|\u2013/.test(rendered), `Unexpected content: ${slide.id}`);
  }
}
const laboratory = deck.find(slide => slide.id === 'laboratory');
assert.ok(laboratory.render({}).includes('Approval stays blocked'), 'Incomplete laboratory example must retain the approval gate.');
assert.ok(laboratory.render({ lab: 'complete' }).includes('Ready for approval'), 'Completed laboratory example must explain approval eligibility.');
const quality = deck.find(slide => slide.id === 'data-quality');
assert.ok(quality.render({}).includes('Hold for identity review.'), 'Uncertain identities must be held.');
assert.ok(quality.render({ match: 'safe' }).includes('Link as a laboratory draft.'), 'Matched imports must still require laboratory approval.');
const reporting = deck.find(slide => slide.id === 'etl-example').render({ loaded: true });
assert.equal((reporting.match(/class="source-row included"/g) || []).length, 4, 'ETL example must include four checked facts.');
assert.equal((reporting.match(/class="source-row excluded"/g) || []).length, 2, 'ETL example must exclude two drafts.');
const app = await readFile(join(output, 'app.js'), 'utf8');
assert.ok(!/\bfetch\s*\(|new\s+(?:WebSocket|XMLHttpRequest)\b/.test(app), 'Presentation must remain independent of the clinic API.');
const assets = [...[html, ...renderedSlides].join('\n').matchAll(/(?:src|href)="\.\/([^"#]+)"/g), ...css.matchAll(/url\('\.\/([^']+)'\)/g)].map(match => match[1]);
for (const path of new Set(assets)) assert.ok((await stat(join(output, path))).isFile(), `Missing asset: ${path}`);
const vercel = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
assert.equal(vercel.framework, null); assert.equal(vercel.outputDirectory, 'dist'); assert.equal(vercel.buildCommand, 'npm run build');
const spoken = '# CareRecord speaking guide\n\nFictional patient and prices; no live clinic data.\n\n' + deck.map((slide, index) => `## ${index + 1}. ${slide.title}\n\n${slide.notes.join('\n\n')}\n\nEvidence: ${slide.evidence}\n`).join('\n');
await writeFile(join(output, 'CareRecord-speaking-guide.md'), spoken, 'utf8');
console.log(`Build passed: ${deck.length} slides, four chapters, all referenced assets, speaker guide and Vercel settings verified.`);
console.log('Static output: dist/ (no backend or environment variables).');
