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
const css = (await Promise.all(['styles.css', 'visuals.css'].map(name => readFile(join(output, name), 'utf8')))).join('\n');
const strippedCSS = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(['"])(?:\\.|(?!\1)[^\\])*?\1/g, '');
assert.equal((strippedCSS.match(/{/g) || []).length, (strippedCSS.match(/}/g) || []).length, 'CSS braces must balance.');
assert.ok(css.includes('prefers-reduced-motion') && css.includes('@media print'), 'Reduced-motion and print rules are required.');
assert.ok(css.includes('.slide-composition') && css.includes('justify-content:safe center'), 'Normal and fullscreen slides need a centered content composition.');
console.log(`Lint passed: ${scripts} JavaScript files, JSON configuration, HTML and CSS checks.`);
if (mode === 'lint') process.exit(0);

const context = vm.createContext({ window: {} });
vm.runInContext(await readFile(join(output, 'icons.js'), 'utf8'), context, { timeout: 3000 });
vm.runInContext(await readFile(join(output, 'slides.js'), 'utf8'), context, { timeout: 3000 });
const deck = context.window.CARE_DECK;
assert.equal(deck.length, 9, 'The condensed presentation has nine slides.');
assert.equal(new Set(deck.map(slide => slide.id)).size, deck.length, 'Slide IDs must be unique.');
assert.equal(new Set(deck.map(slide => slide.chapter)).size, 4, 'Expected four narrative chapters.');
const required = ['welcome', 'the-problem', 'three-pillars', 'complete-workflow', 'governance', 'data-quality', 'etl', 'alignment', 'closing'];
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
    const headings = (rendered.match(/\bid="slide-title"/g) || []).length;
    assert.equal(headings, slide.cover || slide.customHeading ? 1 : 0, `Custom title must replace, not duplicate, the shared title: ${slide.id}`);
  }
}
const quality = deck.find(slide => slide.id === 'data-quality');
assert.ok(quality.render({}).includes('Hold for identity review.'), 'Uncertain identities must be held.');
assert.ok(quality.render({}).includes('Approval stays blocked'), 'Incomplete laboratory example must retain the approval gate.');
assert.ok(quality.render({ lab: 'complete' }).includes('Ready for approval'), 'Completed laboratory example must explain approval eligibility.');
const reporting = deck.find(slide => slide.id === 'etl').render({ loaded: true });
assert.equal((reporting.match(/class="included"/g) || []).length, 4, 'ETL example must include four checked facts.');
assert.ok(reporting.includes('2 drafts excluded: consultation + laboratory'), 'ETL example must exclude both draft types.');
const permissions = deck.find(slide => slide.id === 'governance').render({});
assert.equal((permissions.match(/class="permission-card"/g) || []).length, 6, 'All six responsibilities and permission boundaries must remain visible.');
const workflow = deck.find(slide => slide.id === 'complete-workflow').render({});
for (const concept of ['Register', 'Check in', 'Consult', 'Test request', 'Check and approve', 'Review and plan', 'Prepare invoice', 'Record payment', 'Print receipt']) assert.ok(workflow.includes(concept), `Missing workflow handoff: ${concept}`);
const closing = deck.find(slide => slide.id === 'closing');
assert.equal(closing.customHeading, true, 'Closing slide needs one custom heading without a duplicate title.');
assert.equal((closing.render({}).match(/class="visual-icon"/g) || []).length, 4, 'Closing recap must retain all four EDM concepts.');
const app = await readFile(join(output, 'app.js'), 'utf8');
for (const id of ['notes-toggle', 'index-toggle', 'print-button', 'speaker-notes', 'slide-index']) {
  assert.ok(!html.includes(`id="${id}"`) && !app.includes(`$('${id}')`), `Removed presentation control must stay removed: ${id}`);
}
const documentIDs = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
for (const [, id] of app.matchAll(/\$\('([^']+)'\)/g)) assert.ok(documentIDs.has(id), `Handler references a missing element: ${id}`);
assert.ok(!/\bfetch\s*\(|new\s+(?:WebSocket|XMLHttpRequest)\b/.test(app), 'Presentation must remain independent of the clinic API.');
const assets = [...[html, ...renderedSlides].join('\n').matchAll(/(?:src|href)="\.\/([^"#]+)"/g), ...css.matchAll(/url\('\.\/([^']+)'\)/g)].map(match => match[1]);
for (const path of new Set(assets)) assert.ok((await stat(join(output, path))).isFile(), `Missing asset: ${path}`);
const vercel = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
assert.equal(vercel.framework, null); assert.equal(vercel.outputDirectory, 'dist'); assert.equal(vercel.buildCommand, 'npm run build');
const spoken = '# CareRecord speaking guide\n\nFictional patient and prices; no live clinic data.\n\n' + deck.map((slide, index) => `## ${index + 1}. ${slide.title}\n\n${slide.notes.join('\n\n')}\n\nEvidence: ${slide.evidence}\n`).join('\n');
await writeFile(join(output, 'CareRecord-speaking-guide.md'), spoken, 'utf8');
console.log(`Build passed: ${deck.length} slides, four chapters, all referenced assets, speaker guide and Vercel settings verified.`);
console.log('Static output: dist/ (no backend or environment variables).');
