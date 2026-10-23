import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const file of ['index.html', 'styles.css', 'app.js', 'offer.json', 'assets']) {
  await cp(file, `dist/${file}`, { recursive: true });
}
console.log('Built static website in dist/');
