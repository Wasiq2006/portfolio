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
  content: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const blog = (blogsData.blogs as BlogPost[]).find((b) => b.id === id);

  // Scroll to top when blog detail page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
        const linkText = token.slice(1, token.indexOf(']'));
        const url = token.slice(token.indexOf('(') + 1, token.lastIndexOf(')'));
        parts.push(
          <a
            key={match.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline font-bold hover:opacity-80 transition-opacity"
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
              className="bg-black text-green-400 p-6 rounded-none border-4 border-foreground my-8 overflow-x-auto font-mono text-sm"
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
        // Image
        const alt = trimmed.slice(2, trimmed.indexOf(']'));
        const url = trimmed.slice(trimmed.indexOf('(') + 1, trimmed.lastIndexOf(')'));
        elements.push(
          <div key={idx} className="my-8">
            <img
              src={url}
              alt={alt}
              className="w-full max-h-[500px] object-cover border-4 border-foreground rounded-none"
              style={{ boxShadow: '6px 6px 0px 0px currentColor' }}
            />
            {alt && <p className="text-xs font-mono text-muted-foreground mt-2 text-center">{alt}</p>}
          </div>
        );
      } else if (trimmed.startsWith('<iframe')) {
        // Iframe / Video Embed
        elements.push(
          <div
            key={idx}
            className="my-8 border-4 border-foreground overflow-hidden rounded-none shadow-[6px_6px_0px_0px_currentColor]"
            dangerouslySetInnerHTML={{ __html: trimmed }}
          />
        );
      } else if (trimmed.startsWith('>')) {
        // Blockquote
        const quoteText = trimmed.replace(/^>\s*/, '');
        elements.push(
          <blockquote
            key={idx}
            className="my-6 border-l-4 border-foreground bg-card/60 p-5 pl-6 font-medium text-foreground/90 italic rounded-none"
            style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
          >
            {renderFormattedText(quoteText)}
          </blockquote>
        );
      } else if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={idx} className="text-4xl md:text-5xl font-black mt-16 mb-6 border-b-4 border-foreground pb-4">
            {renderFormattedText(trimmed.replace('# ', ''))}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={idx} className="text-3xl font-black mt-12 mb-4 border-b-2 border-foreground pb-3">
            {renderFormattedText(trimmed.replace('## ', ''))}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className="text-2xl font-bold mt-8 mb-3">
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
              className="list-disc list-inside mb-6 space-y-3 bg-card border-l-4 border-foreground p-6 rounded-none"
            >
              {listItems.map((item, i) => (
                <li key={i} className="text-foreground/80 font-medium">
                  {renderFormattedText(item)}
                </li>
              ))}
            </ul>
          );
          listItems = [];
        }
      } else if (trimmed.startsWith('---')) {
        elements.push(
          <div key={idx} className="my-10 border-t-4 border-foreground" />
        );
      } else if (trimmed) {
        elements.push(
          <p key={idx} className="text-foreground/80 mb-6 leading-relaxed text-lg">
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
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <button
            onClick={handleBackToBlog}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest border-b-2 border-foreground pb-1 hover:gap-4 transition-all mb-8 hover:translate-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm border-t-2 border-foreground pt-6">
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
              <span className="font-mono font-bold uppercase tracking-widest bg-foreground text-background px-3 py-1">
              {blog.readTime}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <article className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="prose prose-lg max-w-none">
          {renderContent(blog.content)}
        </div>

        {/* Back Button */}
        <div className="mt-20 pt-8 border-t-4 border-foreground flex justify-center md:justify-start">
          <button
            onClick={handleBackToBlog}
            className="inline-flex items-center gap-2 px-8 py-4 border-3 border-foreground bg-card text-foreground text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-foreground hover:text-background rounded-none"
            style={{ boxShadow: '6px 6px 0px 0px currentColor' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Blogs
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
