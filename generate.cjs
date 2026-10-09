const fs = require('fs');

const html = fs.readFileSync('story-portfolio.html', 'utf-8');

let body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
let script = body.match(/<script>([\s\S]*?)<\/script>/)[1];

body = body.replace(/<script>[\s\S]*?<\/script>/, '');

function convertToJSX(htmlString) {
  return htmlString
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-dasharray/g, 'strokeDasharray')
    .replace(/stroke-dashoffset/g, 'strokeDashoffset')
    .replace(/clip-path/g, 'clipPath')
    .replace(/preserveAspectRatio/g, 'preserveAspectRatio')
    .replace(/style="([^"]*?)"/g, (match, p1) => {
      const styleObj = p1.split(';').filter(Boolean).map(s => {
        const [k, v] = s.split(':').map(str => str.trim());
        if(!k) return '';
        const camelK = k.replace(/-([a-z])/g, g => g[1].toUpperCase());
        if(k.startsWith('--')) {
          return `'${k}': '${v}'`;
        }
        return `${camelK}: '${v}'`;
      }).join(', ');
      return `style={{${styleObj}}}`;
    })
    .replace(/<img([^>]*?[^\/])>/g, '<img$1 />')
    .replace(/<input([^>]*?[^\/])>/g, '<input$1 />')
    .replace(/<path([^>]*?[^\/])>/g, '<path$1 />')
    .replace(/<circle([^>]*?[^\/])>/g, '<circle$1 />')
    .replace(/<br([^>]*?[^\/])>/g, '<br$1 />');
}

// Split the body into components
const sections = {
  Header: /<header[^>]*>[\s\S]*?<\/header>/,
  ChapterRail: /<nav class="chapter-rail"[^>]*>[\s\S]*?<\/nav>/,
  Hero: /<section class="hero"[^>]*>[\s\S]*?<\/section>/,
  Story: /<section id="story">[\s\S]*?<\/section>/,
  Arsenal: /<section id="arsenal">[\s\S]*?<\/section>/,
  Achievements: /<section id="achievements">[\s\S]*?<\/section>/,
  Showcase: /<section id="showcase">[\s\S]*?<\/section>/,
  Momentum: /<section id="momentum">[\s\S]*?<\/section>/,
  Contact: /<section id="contact">[\s\S]*?<\/section>/,
  Footer: /<footer[^>]*>[\s\S]*?<\/footer>/,
  ProjectModal: /<dialog[^>]*>[\s\S]*?<\/dialog>/,
  Toast: /<div class="toast"[^>]*>[\s\S]*?<\/div>/
};

let appJsx = convertToJSX(body);

let imports = `import { useEffect } from 'react';\nimport './index.css';\n`;
let componentsOutput = '';

for (const [name, regex] of Object.entries(sections)) {
  const match = body.match(regex);
  if (match) {
    const componentCode = convertToJSX(match[0]);
    appJsx = appJsx.replace(convertToJSX(match[0]), "<" + name + " />");
    fs.writeFileSync("src/components/" + name + ".jsx", "export default function " + name + "() { return (" + componentCode + "); }");
    imports += "import " + name + " from './components/" + name + "';\n";
  }
}

const appCode = imports + "\nexport default function App() {\n  useEffect(() => {\n" + script + "\n  }, []);\n\n  return (\n    <>\n      " + appJsx + "\n    </>\n  );\n}\n";


fs.writeFileSync('src/App.jsx', appCode);
console.log('App components generated');
