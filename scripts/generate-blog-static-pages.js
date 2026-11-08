import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const distDir = path.join(projectRoot, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');
const blogJsonPath = path.join(projectRoot, 'src', 'data', 'blog.json');

// Canonical origin. Keep in sync with SITE_URL in src/data/constants.ts.
const SITE_URL = 'https://www.wasiq.tech';

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('Error: dist/index.html does not exist. Run "vite build" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const blogData = JSON.parse(fs.readFileSync(blogJsonPath, 'utf8'));

console.log('Generating static blog HTML pages for link previews (WhatsApp, LinkedIn, Twitter)...');

blogData.blogs.forEach((post) => {
  const postUrl = `${SITE_URL}/blog/${post.id}`;
  const rawImage = post.image || '/images/Banner.png';
  
  // Prefer optimized JPG (< 100KB) for WhatsApp crawler compatibility
  let ogImageRelative = rawImage;
  if (rawImage.endsWith('.png')) {
    const jpgCandidate = rawImage.replace('.png', '_og.jpg');
    if (fs.existsSync(path.join(projectRoot, 'public', jpgCandidate))) {
      ogImageRelative = jpgCandidate;
    }
  }

  const imageUrl = ogImageRelative.startsWith('http') ? ogImageRelative : `${SITE_URL}${ogImageRelative}`;
  const imageType = imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';

  let html = templateHtml;
  const title = escapeAttr(post.title);

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${title} | Wasiq Mansoor</title>`);

  // Replace og:title & twitter:title
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${title} | Wasiq Mansoor" />`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:title" content="${title} | Wasiq Mansoor" />`);

  // Replace description
  const cleanDescription = escapeAttr(post.brief);
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${cleanDescription}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${cleanDescription}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:description" content="${cleanDescription}" />`);

  // Replace canonical & og:url
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${postUrl}" />`);
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

// Generate sitemap.xml from blog.json so new posts are never left out.
const today = new Date().toISOString().slice(0, 10);
const sitemapEntries = [
  { loc: `${SITE_URL}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
  ...blogData.blogs.map((post) => ({
    loc: `${SITE_URL}/blog/${post.id}`,
    lastmod: post.publishedAt,
    changefreq: 'monthly',
    priority: '0.8',
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
console.log(` Generated: dist/sitemap.xml (${sitemapEntries.length} URLs)`);

console.log('Static blog HTML page generation completed successfully!');
