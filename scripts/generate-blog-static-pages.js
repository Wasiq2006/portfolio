import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const distDir = path.join(projectRoot, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');
const blogJsonPath = path.join(projectRoot, 'src', 'data', 'blog.json');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('Error: dist/index.html does not exist. Run "vite build" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const blogData = JSON.parse(fs.readFileSync(blogJsonPath, 'utf8'));

console.log('Generating static blog HTML pages for link previews (WhatsApp, LinkedIn, Twitter)...');

blogData.blogs.forEach((post) => {
  const postUrl = `https://www.wasiq.tech/blog/${post.id}`;
  const rawImage = post.image || '/images/Banner.png';
  
  // Prefer optimized JPG (< 100KB) for WhatsApp crawler compatibility
  let ogImageRelative = rawImage;
  if (rawImage.endsWith('.png')) {
    const jpgCandidate = rawImage.replace('.png', '_og.jpg');
    if (fs.existsSync(path.join(projectRoot, 'public', jpgCandidate))) {
      ogImageRelative = jpgCandidate;
    }
  }

  const imageUrl = ogImageRelative.startsWith('http') ? ogImageRelative : `https://www.wasiq.tech${ogImageRelative}`;
  const imageType = imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';

  let html = templateHtml;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${post.title} | Muhammad Wasiq</title>`);

  // Replace og:title & twitter:title
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${post.title} | Muhammad Wasiq" />`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:title" content="${post.title} | Muhammad Wasiq" />`);

  // Replace description
  const cleanDescription = post.brief.replace(/"/g, '&quot;');
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${cleanDescription}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${cleanDescription}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:description" content="${cleanDescription}" />`);

  // Replace og:url
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:url" content="${postUrl}" />`);

  // Replace og:image & og:image:secure_url & og:image:type & twitter:image
  html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image" content="${imageUrl}" />`);
  html = html.replace(/<meta\s+property="og:image:secure_url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:secure_url" content="${imageUrl}" />`);
  html = html.replace(/<meta\s+property="og:image:type"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:type" content="${imageType}" />`);
  html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:image" content="${imageUrl}" />`);

  // Ensure output directory dist/blog/[id]
  const blogPostDir = path.join(distDir, 'blog', post.id);
  fs.mkdirSync(blogPostDir, { recursive: true });

  const blogPostHtmlFile = path.join(blogPostDir, 'index.html');
  fs.writeFileSync(blogPostHtmlFile, html, 'utf8');

  // Also write dist/blog/[id].html for fallback rewrites
  const blogPostFlatFile = path.join(distDir, 'blog', `${post.id}.html`);
  fs.mkdirSync(path.join(distDir, 'blog'), { recursive: true });
  fs.writeFileSync(blogPostFlatFile, html, 'utf8');

  console.log(` Generated: dist/blog/${post.id}/index.html (og:image -> ${imageUrl})`);
});

console.log('Static blog HTML page generation completed successfully!');
