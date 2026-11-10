import SectionBlock from './SectionBlock';
import AnimatedAvatar from './AnimatedAvatar';

const AboutSection = () => {
  return (
    <SectionBlock id="about" title="About me">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
        <AnimatedAvatar />
        <div className="flex-1">
          <p className="body-text max-w-2xl">
            I'm a Computer Science student at SZABIST. I enjoy talking about tech, experimenting with different tools, and figuring out how things work under the hood.
          </p>
          <p className="body-text max-w-2xl mt-6">
            My interests range from Linux and system internals to reverse engineering, binary exploitation, digital forensics, and machine learning. I also enjoy building projects, breaking things and learning something new along the way.
          </p>
          <p className="body-text max-w-2xl mt-6 mb-8">
            When I'm not studying or working on a project, you'll probably find me exploring Linux, experimenting with a new idea, or diving into a technical rabbit hole.
          </p>
        </div>
      </div>
    </SectionBlock>
  );
};

export default AboutSection;
