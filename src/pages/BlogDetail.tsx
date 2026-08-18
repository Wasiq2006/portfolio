import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useEffect } from 'react';
import blogsData from '@/data/blog.json';
import { playClick } from '@/hooks/useSoundEffects';
import CustomCursor from '@/components/CustomCursor';

interface BlogPost {
  id: string;
  title: string;
  brief: string;
  publishedAt: string;
  readTime: string;
  image?: string;
  mediumUrl?: string;
  content: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const blog = (blogsData.blogs as BlogPost[]).find((b) => b.id === id);

  // Scroll to top and set page title & metadata when blog detail page loads
  useEffect(() => {
    window.scrollTo(0, 0);
    if (blog) {
      document.title = `${blog.title} | Muhammad Wasiq`;

      const updateMetaTag = (selector: string, content: string) => {
        let el = document.querySelector(selector);
        if (el) {
          el.setAttribute('content', content);
        }
      };

      const ogImageUrl = blog.image
        ? (blog.image.startsWith('http') ? blog.image : `https://wasiq.tech${blog.image}`)
        : 'https://wasiq.tech/images/Banner.png';

      updateMetaTag('meta[property="og:title"]', blog.title);
      updateMetaTag('meta[property="og:description"]', blog.brief);
      updateMetaTag('meta[property="og:image"]', ogImageUrl);
      updateMetaTag('meta[property="og:image:secure_url"]', ogImageUrl);
      updateMetaTag('meta[name="twitter:title"]', blog.title);
      updateMetaTag('meta[name="twitter:description"]', blog.brief);
      updateMetaTag('meta[name="twitter:image"]', ogImageUrl);
    }
  }, [id, blog]);

  // Handle navigation back to blog section
  const handleBackToBlog = () => {
    playClick();
    navigate('/');
    // Scroll to blog section after navigation
    setTimeout(() => {
      const blogElement = document.getElementById('blog');
      if (blogElement) {
        blogElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <CustomCursor />
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">404 - Blog Not Found</h1>
          <p className="text-lg mb-6">Sorry, we couldn't find the blog you're looking for.</p>
          <button
            onClick={handleBackToBlog}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-foreground bg-card text-foreground text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-foreground hover:text-background rounded-none"
            style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // Render formatted inline markdown (links, bold, italic, inline code)
  const renderFormattedText = (text: string): React.ReactNode => {
    const regex = /(\[.*?\]\(.*?\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('[')) {
        const lastBracketIndex = token.lastIndexOf(']');
        const linkText = token.slice(1, lastBracketIndex);
        let url = token.slice(lastBracketIndex + 2, token.length - 1).trim();
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:') && !url.startsWith('#') && !url.startsWith('/')) {
          url = `https://${url}`;
        }
        parts.push(
          <a
            key={match.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline font-bold hover:opacity-80 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {linkText}
          </a>
        );
      } else if (token.startsWith('**')) {
        parts.push(<strong key={match.index} className="font-black text-foreground">{token.slice(2, -2)}</strong>);
      } else if (token.startsWith('*')) {
        parts.push(<em key={match.index} className="italic text-foreground/90">{token.slice(1, -1)}</em>);
      } else if (token.startsWith('`')) {
        parts.push(
          <code key={match.index} className="bg-muted px-1.5 py-0.5 font-mono text-sm border border-foreground/20">
            {token.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Parse markdown content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';
    let listItems: string[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Handle code blocks
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${idx}`}
              className="bg-black text-green-400 p-4 sm:p-6 rounded-none border-2 sm:border-4 border-foreground my-6 sm:my-8 overflow-x-auto font-mono text-xs sm:text-sm max-w-full"
              style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
            >
              <code>{codeContent}</code>
            </pre>
          );
          inCodeBlock = false;
          codeContent = '';
          codeLanguage = '';
        } else {
          inCodeBlock = true;
          codeLanguage = trimmed.replace('```', '').trim();
        }
      } else if (inCodeBlock) {
        codeContent += line + '\n';
      } else if (trimmed.startsWith('![') && trimmed.includes('](')) {
        // Banner / Content Image matching Brutalist Design (Image 2)
        const alt = trimmed.slice(2, trimmed.indexOf(']'));
        const url = trimmed.slice(trimmed.indexOf('(') + 1, trimmed.lastIndexOf(')'));
        elements.push(
          <div key={idx} className="my-8 sm:my-10 flex flex-col items-center w-full">
            <div
              className="w-full max-w-3xl border-4 border-foreground bg-card overflow-hidden rounded-none"
              style={{ boxShadow: '6px 6px 0px 0px currentColor' }}
            >
              <img
                src={url}
                alt={alt}
                className="w-full h-auto object-cover max-h-[500px] rounded-none block"
              />
            </div>
            {alt && (
              <p className="text-xs font-mono text-foreground/80 mt-3 text-center tracking-wide">
                {alt}
              </p>
            )}
          </div>
        );
      } else if (trimmed.startsWith('<iframe')) {
        // Extract src & title from raw iframe tag to render a clean, 100% responsive YouTube frame (Image 1 fix)
        const srcMatch = trimmed.match(/src="([^"]+)"/i);
        const titleMatch = trimmed.match(/title="([^"]+)"/i);
        const videoSrc = srcMatch ? srcMatch[1] : '';
        const videoTitle = titleMatch ? titleMatch[1] : 'YouTube Video Player';

        elements.push(
          <div
            key={idx}
            className="my-8 sm:my-10 flex flex-col items-center w-full"
          >
            <div
              className="relative w-full max-w-3xl aspect-video border-4 border-foreground bg-black overflow-hidden rounded-none"
              style={{ boxShadow: '6px 6px 0px 0px currentColor' }}
            >
              <iframe
                src={videoSrc}
                title={videoTitle}
                className="w-full h-full absolute inset-0 border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        );
      } else if (trimmed.startsWith('>')) {
        // Blockquote
        const quoteText = trimmed.replace(/^>\s*/, '');
        elements.push(
          <blockquote
            key={idx}
            className="my-6 border-l-4 border-foreground bg-card/60 p-4 sm:p-5 pl-5 sm:pl-6 font-medium text-foreground/90 italic rounded-none text-sm sm:text-base"
            style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
          >
            {renderFormattedText(quoteText)}
          </blockquote>
        );
      } else if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={idx} className="text-2xl sm:text-4xl md:text-5xl font-black mt-10 sm:mt-16 mb-4 sm:mb-6 border-b-2 sm:border-b-4 border-foreground pb-3 sm:pb-4 leading-tight break-words">
            {renderFormattedText(trimmed.replace('# ', ''))}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={idx} className="text-xl sm:text-3xl font-black mt-8 sm:mt-12 mb-3 border-b-2 border-foreground pb-2 sm:pb-3 leading-snug break-words">
            {renderFormattedText(trimmed.replace('## ', ''))}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className="text-lg sm:text-2xl font-bold mt-6 sm:mt-8 mb-2 leading-snug break-words">
            {renderFormattedText(trimmed.replace('### ', ''))}
          </h3>
        );
      } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const itemText = trimmed.slice(2).trim();
        listItems.push(itemText);
        if (idx === lines.length - 1 || (!lines[idx + 1].trim().startsWith('* ') && !lines[idx + 1].trim().startsWith('- '))) {
          elements.push(
            <ul
              key={`list-${idx}`}
              className="list-disc list-inside mb-6 space-y-2 bg-card border-l-4 border-foreground p-4 sm:p-6 rounded-none text-sm sm:text-base"
            >
              {listItems.map((item, i) => (
                <li key={i} className="text-foreground/80 font-medium break-words">
                  {renderFormattedText(item)}
                </li>
              ))}
            </ul>
          );
          listItems = [];
        }
      } else if (trimmed.startsWith('---')) {
        elements.push(
          <div key={idx} className="my-8 sm:my-10 border-t-2 sm:border-t-4 border-foreground" />
        );
      } else if (trimmed) {
        elements.push(
          <p key={idx} className="text-foreground/80 mb-5 sm:mb-6 leading-relaxed text-base sm:text-lg break-words">
            {renderFormattedText(trimmed)}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      
      {/* Hero Section */}
      <div className="border-b-4 border-foreground bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 sm:py-16 md:py-24">
          <button
            onClick={handleBackToBlog}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest border-b-2 border-foreground pb-1 hover:gap-4 transition-all mb-6 sm:mb-8 hover:translate-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 leading-tight break-words">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm border-t-2 border-foreground pt-4 sm:pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {new Date(blog.publishedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <span className="font-mono font-bold uppercase tracking-widest bg-foreground text-background px-2.5 py-1 text-[11px] sm:text-xs">
              {blog.readTime}
            </span>

            {blog.mediumUrl && (
              <a
                href={blog.mediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-foreground bg-card text-foreground text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-foreground hover:text-background rounded-none ml-auto"
                style={{ boxShadow: '3px 3px 0px 0px currentColor' }}
              >
                <span>Read On Medium:</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <article className="max-w-4xl mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-20">
        <div className="prose prose-lg max-w-none">
          {renderContent(blog.content)}
        </div>

        {/* Back and Medium Action Buttons */}
        <div className="mt-12 sm:mt-20 pt-6 sm:pt-8 border-t-2 sm:border-t-4 border-foreground flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleBackToBlog}
            className="inline-flex items-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 border-2 sm:border-3 border-foreground bg-card text-foreground text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-foreground hover:text-background rounded-none"
            style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back to All Blogs
          </button>

          {blog.mediumUrl && (
            <a
              href={blog.mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick()}
              className="inline-flex items-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 border-2 sm:border-3 border-foreground bg-card text-foreground text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-foreground hover:text-background rounded-none"
              style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
            >
              <span>Read On Medium:</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
              </svg>
            </a>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
