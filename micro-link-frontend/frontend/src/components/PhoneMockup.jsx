// src/components/PhoneMockup.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CheckIcon = () => (
  <svg className="w-6 h-6 text-[#3b0764]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
  </svg>
);

const features = [
  { title: "Simple", desc: "Without documents or agent visit" },
  { title: "Fast",   desc: "Get notified usually within a few days" },
  { title: "Private", desc: "Data is never collected outside of your verified address" },
];

export default function PhoneMockup() {
  const phoneRef   = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Phone slides up from below
      gsap.fromTo(phoneRef.current,
        { yPercent: 60, opacity: 0 },
        {
          yPercent: 0, opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: phoneRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Screen content items stagger in after phone arrives
      gsap.fromTo(".phone-item",
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.4,
          scrollTrigger: {
            trigger: phoneRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative h-[480px] flex items-center justify-center" ref={phoneRef}>

      {/* Decorative background blob */}
      <div className="absolute inset-y-10 inset-x-0 bg-gradient-to-r from-[#1e1b4b] to-[#4c1d95] rounded-[3rem] transform skew-y-3 shadow-2xl" />

      {/* Phone shell */}
      <div className="relative w-64 h-[450px] bg-white rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden flex flex-col">

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-b-2xl z-10" />

        {/* Screen content */}
        <div ref={contentRef} className="flex flex-col h-full px-5 pt-10 pb-5 overflow-hidden">

          {/* Back arrow */}
          <div className="phone-item mt-2 mb-3">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>

          {/* Logo badge */}
          <div className="phone-item mb-4">
            <span className="border border-[#6d28d9] rounded-lg px-2 py-1 text-[10px] font-semibold text-slate-700">
              Your<span className="font-black text-[#3b0764]">App</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="phone-item text-[15px] font-black text-[#3b0764] leading-tight mb-4">
            Address verification
          </h3>

          {/* Feature list */}
          <div className="flex flex-col gap-3 flex-1">
            {features.map(({ title, desc }) => (
              <div key={title} className="phone-item flex items-start gap-2">
                <div className="mt-0.5 shrink-0"><CheckIcon /></div>
                <div>
                  <p className="text-[11px] font-black text-[#3b0764]">{title}</p>
                  <p className="text-[9px] text-slate-500 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Start button */}
          <button className="phone-item w-full bg-[#3b0764] text-white text-[11px] font-semibold py-3 rounded-xl mt-4">
            Start
          </button>

          {/* Footer */}
          <p className="phone-item text-center text-[8px] text-slate-400 mt-3">
            Powered by <span className="font-black text-slate-600">OkHi</span>
          </p>
        </div>
      </div>
    </div>
  );
}