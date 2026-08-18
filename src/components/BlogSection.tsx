import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar } from 'lucide-react';
import SectionBlock from './SectionBlock';
import { playHover, playClick } from '@/hooks/useSoundEffects';
import blogsData from '@/data/blog.json';

import Scroll3DCard from './Scroll3DCard';

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

const BlogSection = () => {
  const navigate = useNavigate();
  const posts: BlogPost[] = blogsData.blogs;

  return (
    <SectionBlock id="blog" title="Latest Writing">
      <div className="flex flex-col gap-8">
        <p className="body-text max-w-2xl">
          I regularly share my findings, tutorials, and thoughts on cybersecurity,
          DevOps, and system administration.
        </p>

        <div className="flex md:grid md:grid-cols-2 gap-8 overflow-x-auto md:overflow-x-visible pt-6 pb-12 md:py-0 snap-x snap-mandatory scrollbar-hide px-4 md:px-0 -mx-4 md:mx-0">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Scroll3DCard
                key={post.id}
                className="min-w-[290px] sm:min-w-[320px] w-[85vw] md:w-auto snap-start flex-shrink-0 md:flex-shrink"
              >
                <article
                  className="group relative border-4 border-foreground bg-card p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 rounded-none h-full"
                  style={{ boxShadow: '8px 8px 0px 0px transparent' }}
                  onMouseEnter={(e) => { playHover(); (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0px 0px currentColor'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0px 0px transparent'; }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-3 h-3 text-foreground/50" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">
                        {new Date(post.publishedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 ml-auto">
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-black mb-3 line-clamp-2 leading-tight group-hover:underline">
                      {post.title}
                    </h3>

                    <p className="text-sm font-light text-foreground/70 mb-6 line-clamp-3 leading-relaxed">
                      {post.brief}
                    </p>
                  </div>

                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => {
                        playClick();
                        navigate(`/blog/${post.id}`);
                      }}
                      className="inline-flex items-center justify-center w-full py-3 border-2 border-foreground bg-background text-foreground text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-foreground hover:text-background hover:shadow-none translate-y-0 active:translate-y-[2px] rounded-none"
                      style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0px 0px currentColor'; }}
                    >
                      Read Full Blog
                    </button>
                  </div>
                </article>
              </Scroll3DCard>
            ))
          ) : (
            <div className="col-span-full py-12 text-center border-2 border-foreground border-dashed opacity-50 w-full">
              <p className="font-mono text-sm uppercase tracking-widest">
                No blog posts found. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </SectionBlock>
  );
};

export default BlogSection;
