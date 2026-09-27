import { execSync } from 'node:child_process';
import fs from 'node:fs';

console.log('🚀 Building SeeOut for GitHub Pages (/See_Out/)...');
execSync('npm run build:web', { stdio: 'inherit' });

fs.writeFileSync('dist/.nojekyll', '');
fs.copyFileSync('dist/index.html', 'dist/404.html');

console.log('📦 Pushing static dist bundle to gh-pages branch...');
process.env.GIT_INDEX_FILE = '.git/deploy_index';
execSync('git add -f dist', { stdio: 'inherit' });
const treeId = execSync('git write-tree --prefix=dist', { encoding: 'utf-8' }).trim();
const commitId = execSync(`git commit-tree ${treeId} -m "Deploy to GitHub Pages (production build)"`, { encoding: 'utf-8' }).trim();
execSync(`git push origin ${commitId}:refs/heads/gh-pages --force`, { stdio: 'inherit' });

if (fs.existsSync('.git/deploy_index')) {
  fs.unlinkSync('.git/deploy_index');
}

console.log('✅ GitHub Pages deployment completed successfully!');
