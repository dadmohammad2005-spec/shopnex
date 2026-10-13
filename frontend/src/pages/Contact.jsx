import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { contactService } from '../services/api';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await contactService.sendMessage(formData);
      setSubmitted(true);
      showToast('Your message has been sent successfully!', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 sm:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2 block">
            Customer Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Get in Touch with Our Concierge
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Have a question regarding an order, product specifications, or enterprise bulk gifting? We are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Information Cards (Left 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-950/80 border border-brand-800/80 text-brand-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Headquarters</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Quetta, Balochistan, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-950/80 border border-brand-800/80 text-brand-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Email Concierge</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    <a href="mailto:dadmohammad2005@gmail.com" className="hover:text-brand-300 font-semibold text-brand-400 transition-colors">
                      dadmohammad2005@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-950/80 border border-brand-800/80 text-brand-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Direct Telephone</h4>
                  <p className="text-xs text-slate-300 mt-0.5">+1 (800) 849-2910</p>
                  <p className="text-[11px] text-slate-500">Toll-free across North America</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Operational Hours</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Monday – Friday: 24 Hours</p>
                  <p className="text-xs text-slate-400">Weekend: 9:00 AM – 6:00 PM PST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form (Right 7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-xl">
              <h3 className="text-base font-bold text-white mb-2">Send an Inquiry</h3>
              <p className="text-xs text-slate-400 mb-6">Our average response time is under 2 business hours.</p>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Thank you! Your message has been received. Our team will contact you shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Order Inquiry / Sizing Assistance"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Detailed Message *</label>
                  <textarea
                    required
                    rows="5"
                    placeholder="Please include relevant order numbers or product details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-slate-700 text-xs sm:text-sm bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-800 outline-none focus:border-brand-500 transition-colors"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-brand-900/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Dispatching Message...' : 'Submit Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
