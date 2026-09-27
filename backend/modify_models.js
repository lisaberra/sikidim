const fs = require('fs');
let content = fs.readFileSync('main.py', 'utf-8');
content = content.replace(/gemini-3\.6-flash/g, 'gemini-2.0-flash');
fs.writeFileSync('main.py', content, 'utf-8');

let content2 = fs.readFileSync('clothing_analysis.py', 'utf-8');
content2 = content2.replace(/gemini-2\.5-flash/g, 'gemini-2.0-flash');
fs.writeFileSync('clothing_analysis.py', content2, 'utf-8');