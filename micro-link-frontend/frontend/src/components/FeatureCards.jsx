import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    emoji: "🏆",
    label: "Gamification & Rewards",
    desc: "Level up, earn badges, and compete on leaderboards. We reward interaction to make every click meaningful.",
    accent: "#3b82f6",
    bg: "#eff6ff",
    grad: "from-blue-500/10 via-transparent to-transparent",
    border: "hover:border-blue-200",
  },
  {
    emoji: "🎨",
    label: "Content Categorization",
    desc: "Effortlessly discover content tailored to you with curated feeds based on your exact interests and network.",
    accent: "#a855f7",
    bg: "#faf5ff",
    grad: "from-purple-500/10 via-transparent to-transparent",
    border: "hover:border-purple-200",
  },
  {
    emoji: "💬",
    label: "Engaging Community",
    desc: "Join active groups, follow trends, and involve yourself directly in the conversations that matter most to you.",
    accent: "#10b981",
    bg: "#ecfdf5",
    grad: "from-emerald-500/10 via-transparent to-transparent",
    border: "hover:border-emerald-200",
  },
];

export default function FeatureCards() {
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".feature-card",
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map(({ emoji, label, desc, accent, bg, grad, border }) => (
        <div
          key={label}
          className={`feature-card group relative bg-white p-8 rounded-[2rem] border border-slate-100 ${border} shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-default`}
        >
          {/* Gradient wash on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          {/* Glowing orb behind icon */}
          <div
            className="absolute -top-6 -left-6 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{ backgroundColor: accent }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: bg }}
            >
              {emoji}
            </div>

            {/* Title */}
            <h3 className="text-xl font-black text-slate-900 font-display leading-tight mb-3 group-hover:translate-x-1 transition-transform duration-300">
              {label}
            </h3>

            {/* Divider line that grows on hover */}
            <div
              className="h-0.5 w-8 group-hover:w-16 rounded-full mb-4 transition-all duration-500"
              style={{ backgroundColor: accent }}
            />

            {/* Description */}
            <p className="text-slate-500 text-sm leading-relaxed">
              {desc}
            </p>
          </div>

          {/* Bottom-right corner accent */}
          <div
            className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-[2rem] opacity-0 group-hover:opacity-5 transition-opacity duration-500"
            style={{ backgroundColor: accent }}
          />
        </div>
      ))}
    </div>
  );
}