import { type ReactNode } from 'react';
import Scroll3DSection from './Scroll3DSection';

interface SectionBlockProps {
  id: string;
  title: string;
  children: ReactNode;
}

const SectionBlock = ({ id, title, children }: SectionBlockProps) => {
  return (
    <section id={id} className="max-w-6xl mx-auto px-6 py-16 md:py-28">
      <Scroll3DSection>
        <h2 className="section-title mb-12">{title}.</h2>
        {children}
      </Scroll3DSection>
    </section>
  );
};

export default SectionBlock;
