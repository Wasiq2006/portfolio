import SectionBlock from './SectionBlock';
import AnimatedAvatar from './AnimatedAvatar';

const AboutSection = () => {
  return (
    <SectionBlock id="about" title="About me">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
        <AnimatedAvatar />
        <div className="flex-1">
          <p className="body-text max-w-2xl">
            I am a Computer Science student with a strong interest in Cyber Security and Artificial Intelligence. My journey into technology started during college when I learned about the OSI model, which sparked my curiosity about how systems communicate and where vulnerabilities exist. This led me to explore cybersecurity in depth, focusing on practical skills, tools, and real-world problem solving.
          </p>
          <p className="body-text max-w-2xl mt-6">
            As I gained experience working with Linux systems and networking, I developed a growing interest in Artificial Intelligence, especially computer vision and applying AI to real-world problems. In Shehri AI, I used YOLOv8 models to detect and score civic issues from photos, served through a hardened, rate-limited API. I enjoy working where security and AI meet: building systems that are intelligent, secure, and resilient.
          </p>
          <p className="body-text max-w-2xl mt-6 mb-8">
            I am actively building hands-on projects to strengthen my skills in cyber security and artificial intelligence, with a focus on applying what I learn in practical environments. I am passionate about continuous learning and staying updated with emerging technologies, aiming to build a strong career at the intersection of cyber security and AI.
          </p>
        </div>
      </div>
    </SectionBlock>
  );
};

export default AboutSection;
