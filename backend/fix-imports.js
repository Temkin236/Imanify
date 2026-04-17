import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // replace `from './X'` with `from './X.js'`
    content = content.replace(/(from\s+['"]\.[^'"]+)(?<!\.js)(['"])/g, '$1.js$2');
    // replace `import './X'` with `import './X.js'`
    content = content.replace(/(import\s+['"]\.[^'"]+)(?<!\.js)(['"])/g, '$1.js$2');
    fs.writeFileSync(file, content);
});
console.log('Fixed imports!');
