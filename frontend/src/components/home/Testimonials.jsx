import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const Testimonials = () => {
  const { siteName } = useStore();
  const reviews = [
    {
      id: 1,
      quote: "The AeroSound Pro headphones exceeded my highest expectations. The active noise cancelling made my cross-country flights whisper quiet.",
      name: "Marcus Vance",
      role: "Architect, San Francisco",
      rating: 5,
      product: "AeroSound Pro Wireless ANC",
    },
    {
      id: 2,
      quote: "Remarkable craftsmanship on the Italian cashmere coat. The tailoring is flawless, and it arrived in immaculate packaging within 2 business days.",
      name: "Elena Rostova",
      role: "Creative Director, New York",
      rating: 5,
      product: "Nordic Heritage Cashmere Coat",
    },
    {
      id: 3,
      quote: "Finally an espresso machine that matches commercial third-wave cafes. Intuitive controls, flawless extraction pressure, and elegant aesthetic.",
      name: "David Chen",
      role: "Product Lead, Seattle",
      rating: 5,
      product: "Barista Artisan Touch Espresso",
    },
  ];

  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2 block">
            Client Voices
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Loved by Connoisseurs Worldwide
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Over 40,000 international customers trust {siteName} for authenticity, quality, and concierge service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-sm hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Stars and Quote mark */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-700" />
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-medium italic">
                  "{r.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{r.name}</h4>
                  <span className="text-[11px] text-slate-400">{r.role}</span>
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
