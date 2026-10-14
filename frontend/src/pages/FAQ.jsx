import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { siteName, freeShippingThreshold } = useStore();

  const faqs = [
    {
      category: 'Orders & Global Shipping',
      items: [
        {
          q: 'How long will delivery take for my order?',
          a: 'Standard domestic shipments are delivered within 2-4 business days. International express air deliveries generally arrive within 3-6 business days depending on customs clearance.',
        },
        {
          q: 'Do you offer free shipping?',
          a: `Yes, all orders exceeding $${freeShippingThreshold} automatically receive complimentary worldwide priority shipping. For orders below $${freeShippingThreshold}, standard flat rate shipping is $10.`,
        },
        {
          q: 'How do I monitor the live tracking status of my package?',
          a: 'Once your order is processed, a tracking number is automatically generated and visible in your Account Dashboard under "My Orders", as well as emailed to your address.',
        },
      ],
    },
    {
      category: 'Payments & Transactions',
      items: [
        {
          q: 'Is Cash on Delivery (COD) supported?',
          a: `Yes! ${siteName} proudly supports Cash on Delivery across eligible locations. You can inspect your parcel and pay the verified courier upon arrival.`,
        },
        {
          q: 'How are payment transactions secured?',
          a: 'All credit/debit transactions are protected with bank-grade 256-bit TLS encryption. We never store raw payment credentials or security codes on our servers.',
        },
        {
          q: 'Can I apply discount promo codes at checkout?',
          a: 'Yes, enter any valid coupon code (e.g. WELCOME10 for 10% off) directly in your cart or checkout page to apply real-time savings.',
        },
      ],
    },
    {
      category: 'Returns, Exchanges & Warranty',
      items: [
        {
          q: `What is the ${siteName} return policy?`,
          a: 'We provide a 30-day trial period from the date of package delivery. If you are not satisfied, submit a return request through your dashboard for a full refund.',
        },
        {
          q: 'Are all products covered by manufacturer warranties?',
          a: 'All electronic devices and timepieces come backed with an international 2-year warranty covering manufacturing defects and technical calibration.',
        },
      ],
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 sm:py-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2 block">
            Knowledge Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Quick answers regarding ordering, shipping timelines, returns, and payment methods.
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((group, gIdx) => (
            <div key={gIdx} className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
              <h2 className="text-base sm:text-lg font-bold text-white mb-4 pb-3 border-b border-slate-800">
                {group.category}
              </h2>
              <div className="space-y-3">
                {group.items.map((item, iIdx) => {
                  const uniqueKey = `${gIdx}-${iIdx}`;
                  const isOpen = openIndex === uniqueKey;
                  return (
                    <div
                      key={uniqueKey}
                      className="border border-slate-800 rounded-2xl overflow-hidden transition-all bg-slate-850/40"
                    >
                      <button
                        onClick={() => toggleAccordion(uniqueKey)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-white hover:bg-slate-800/60 transition-colors"
                      >
                        <span>{item.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 bg-slate-800/30">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact fallback */}
        <div className="mt-12 text-center bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1">Still have unanswered questions?</h3>
          <p className="text-xs text-slate-400 mb-4">Our concierge is available around the clock to support you.</p>
          <Link
            to="/contact"
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-900/40 inline-block transition-colors"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
