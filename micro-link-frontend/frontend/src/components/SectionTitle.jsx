// src/components/SectionTitle.jsx
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

const SectionTitle = ({ title, containerClass }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }).fromTo(
        ".section-word",
        {
          yPercent: 110,
          opacity: 0,
          skewX: 8,
        },
        {
          yPercent: 0,
          opacity: 1,
          skewX: 0,
          ease: "power4.out",
          duration: 0.7,
          stagger: 0.08,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={clsx(containerClass)}>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {title.split(" ").map((word, idx) => (
          <div key={idx} className="overflow-hidden">
            <span
              className="section-word inline-block"
              dangerouslySetInnerHTML={{ __html: word }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionTitle;