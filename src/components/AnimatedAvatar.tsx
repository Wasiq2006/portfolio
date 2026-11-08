/**
 * Round avatar: the photo is a transparent-cornered circle (public/images/avatar.webp),
 * framed by a single circular border.
 * The whole circle floats; floating the photo inside the frame would open a gap at the rim.
 */
const AnimatedAvatar = () => (
  <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto md:mx-0 shrink-0 group animate-[float_6s_ease-in-out_infinite] motion-reduce:animate-none">
    {/* Circular frame */}
    <div className="relative w-full h-full rounded-full border-2 border-foreground bg-card overflow-hidden">
      <img
        src="/images/avatar.webp"
        alt="Wasiq Mansoor"
        width={640}
        height={640}
        className="w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
      {/* Subtle scan line overlay (clipped to the circle by the frame) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 3px)',
        }}
      />
    </div>

    {/* Status badge */}
    <div className="absolute bottom-1 -right-3 md:bottom-3 md:-right-2 bg-foreground text-background px-3 py-1 text-[10px] font-mono uppercase tracking-widest border border-foreground z-10">
      <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-none mr-1.5 animate-pulse" />
      Available
    </div>
  </div>
);

export default AnimatedAvatar;
