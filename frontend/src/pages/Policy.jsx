import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

const Policy = ({ type = 'privacy' }) => {
  const location = useLocation();

  let effectiveType = type;
  if (location.pathname.includes('privacy')) effectiveType = 'privacy';
  else if (location.pathname.includes('terms')) effectiveType = 'terms';
  else if (location.pathname.includes('shipping')) effectiveType = 'shipping';
  else if (location.pathname.includes('return')) effectiveType = 'returns';

  const content = {
    privacy: {
      title: 'Privacy Policy',
      icon: <ShieldCheck className="w-8 h-8 text-brand-400" />,
      subtitle: 'Last updated: October 2026',
      sections: [
        {
          heading: '1. Information We Collect',
          body: 'We collect information you provide directly, including your name, email address, physical delivery address, and telephone number when placing an order or registering an account. All credentials and payment details are encrypted.',
        },
        {
          heading: '2. How We Utilize Your Data',
          body: 'Your data is strictly utilized to process transactions, deliver parcels via verified international courier networks, provide customer support, and inform you of important order status updates.',
        },
        {
          heading: '3. Data Security & Storage',
          body: 'We deploy industry-standard 256-bit SSL encryption. We do not sell, rent, or lease customer data to third-party advertisers or behavioral brokers.',
        },
      ],
    },
    terms: {
      title: 'Terms and Conditions',
      icon: <FileText className="w-8 h-8 text-brand-400" />,
      subtitle: 'Effective October 2026',
      sections: [
        {
          heading: '1. Acceptance of Terms',
          body: 'By browsing and purchasing products from ShopNex, you agree to comply with our international commercial terms, catalog pricing policies, and operational terms.',
        },
        {
          heading: '2. Product Pricing & Accuracy',
          body: 'All catalog pricing is denominated in USD. All orders are reviewed and processed by our automated transaction system, and inventory is reserved upon order completion.',
        },
        {
          heading: '3. Intellectual Property',
          body: 'All trademarks, logos, photographs, and UI components displayed on ShopNex are the proprietary intellectual property of ShopNex International Inc.',
        },
      ],
    },
    shipping: {
      title: 'Shipping Policy',
      icon: <Truck className="w-8 h-8 text-brand-400" />,
      subtitle: 'Worldwide Delivery Standards',
      sections: [
        {
          heading: '1. Order Dispatch Timeframes',
          body: 'All standard orders are verified and dispatched within 24 to 48 business hours from our certified fulfillment centers.',
        },
        {
          heading: '2. Free Shipping Threshold',
          body: 'Orders with a merchandise subtotal of $100.00 or greater receive complimentary worldwide priority shipping. For orders below $100.00, flat rate shipping of $10.00 applies.',
        },
        {
          heading: '3. Live Tracking & Customs',
          body: 'Every dispatched order receives a real-time carrier tracking link. International customs declarations and import duties are coordinated to prevent parcel delays.',
        },
      ],
    },
    returns: {
      title: 'Return and Refund Policy',
      icon: <RotateCcw className="w-8 h-8 text-brand-400" />,
      subtitle: '30-Day Client Guarantee',
      sections: [
        {
          heading: '1. 30-Day Hassle-Free Returns',
          body: 'If you are not thoroughly delighted with your ShopNex purchase, you may initiate a return within 30 days of receiving your package.',
        },
        {
          heading: '2. Condition of Returned Merchandise',
          body: 'Returned items must remain in original aesthetic condition with all original packaging, tags, accessories, and documentation intact.',
        },
        {
          heading: '3. Rapid Refund Processing',
          body: 'Upon inspection at our fulfillment facility, approved refunds are reimbursed within 3-5 business days directly to the original payment channel or registered customer account.',
        },
      ],
    },
  };

  const current = content[effectiveType] || content.privacy;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 sm:py-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
            <div className="w-14 h-14 bg-brand-950/80 border border-brand-800/80 rounded-2xl flex items-center justify-center shrink-0">
              {current.icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {current.title}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">{current.subtitle}</p>
            </div>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-slate-400 leading-relaxed">
            {current.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white">{sec.heading}</h3>
                <p>{sec.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>ShopNex Legal Compliance Team</span>
            <Link to="/contact" className="font-bold text-brand-400 hover:underline">
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy;
