import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { openAuthModal } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does SocialPilot AI learn my business's brand voice?",
      a: "SocialPilot AI analyzes your business description, category, target audience, and brand parameters during onboarding. Whenever you manually edit any AI caption, our persistent Brand Voice Memory system automatically records your preferred phrases, tone rules, and words to avoid!"
    },
    {
      q: "Does this require an Instagram Professional Account?",
      a: "Yes. Meta's official APIs require an Instagram Professional (Business or Creator) account connected to a Facebook Page to support official automated scheduling and publishing."
    },
    {
      q: "Will SocialPilot AI ask for my Instagram password?",
      a: "Never! SocialPilot AI uses Meta's official OAuth authorization flow. We never ask for, store, or see your Instagram password."
    },
    {
      q: "Can I edit AI-generated posts before they are published?",
      a: "Absolutely. You can edit captions, hashtags, CTAs, dates, and times, or click 'Regenerate' with custom instructions like 'Make it shorter' or 'Make it more funny'."
    },
    {
      q: "What happens if Meta publishing fails for a scheduled post?",
      a: "The post status transitions to 'Failed', technical error logs are captured, and you get a clear notification with a 1-click 'Retry Publishing' button."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">SocialPilot AI</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Start for Free
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold shadow-sm">
          <Sparkles className="w-4 h-4" /> Your AI Marketing Manager
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Plan, create, edit and schedule your social media content — <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">without spending hours figuring out what to post.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Connect your Instagram Professional account, tell SocialPilot AI about your business, and get a personalized 7-day Instagram content plan automatically scheduled via official Meta APIs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => openAuthModal('signup')}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Start for Free <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm rounded-2xl transition-all flex items-center justify-center cursor-pointer"
          >
            See How It Works
          </a>
        </div>

        {/* Hero Visual Card Preview */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="p-3 sm:p-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="aspect-[16/9] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative flex flex-col justify-between p-6">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span className="text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 7-Day Instagram Content Plan
                </span>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                  ● Scheduled via Meta APIs
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 my-4">
                {['Mon • Educational Reel', 'Tue • Carousel Guide', 'Wed • Story Poll', 'Thu • Studio Reel', 'Fri • Product Feature', 'Sat • Customer Proof', 'Sun • Community'].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 block">Day #{idx + 1}</span>
                    <span className="text-xs font-bold text-white block line-clamp-1">{item.split('•')[1]}</span>
                    <span className="text-[9px] text-slate-400 block">Scheduled 09:30 AM</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <span>Business: Artisan Bloom Coffee</span>
                <span className="text-indigo-400 font-bold">1-Click Approve & Schedule All →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feature 1: AI-powered content planning */}
      <section id="features" className="py-16 bg-slate-900/50 border-y border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Feature #1</span>
            <h2 className="text-3xl font-extrabold text-white">AI-Powered Content Planning</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              No more wondering "What should my business post today?". SocialPilot AI analyzes your industry, target audience, and business goals to generate a strategic, balanced weekly mix of Educational Reels, Carousels, Stories, and Product Spotlights.
            </p>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              <span className="text-xs text-white font-bold">Dynamic Strategy for Restaurants, Real Estate, Fashion & Tech</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              <span className="text-xs text-white font-bold">Balanced Content Types (Reels, Carousels, Stories, Posts)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature 2: Personalized brand voice */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-xl order-2 md:order-1">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 font-semibold">
              ✕ Avoids generic buzzwords: "Elevate your...", "Unlock your...", "Step into..."
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 font-semibold">
              ✓ Learns your natural brand phrase preferences automatically whenever you edit.
            </div>
          </div>
          <div className="space-y-4 order-1 md:order-2">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Feature #2</span>
            <h2 className="text-3xl font-extrabold text-white">Personalized Brand Voice & Memory</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              SocialPilot AI doesn't sound like a generic AI bot. Our Brand Voice Memory records every manual text correction you make, learning to avoid corporate clichés and prefer short, authentic language tailored to your brand.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Feature 3: 7-day content calendar */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <span className="text-xs font-extrabold text-pink-400 uppercase tracking-wider">Feature #3</span>
          <h2 className="text-3xl font-extrabold text-white">7-Day Instagram Content Calendar</h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            View your entire week at a glance with status badges (Draft, Approved, Scheduled, Published, Failed) and recommended posting times.
          </p>
        </div>
      </section>

      {/* 6. How it Works */}
      <section id="how-it-works" className="py-20 px-4 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">How SocialPilot AI Works</h2>
          <p className="text-xs text-slate-400">Get up and running in less than 3 minutes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Connect Instagram", desc: "Log in with Meta OAuth to link your Instagram Professional account." },
            { step: "2", title: "Answer 10 Questions", desc: "Tell the AI about your business category, audience, products, and voice." },
            { step: "3", title: "Review 7-Day Plan", desc: "Review AI-generated captions, hashtags, CTAs, and posting times." },
            { step: "4", title: "Approve & Schedule", desc: "Click Approve All. The system automatically publishes via official Meta APIs." }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center">
                {item.step}
              </div>
              <h3 className="font-extrabold text-base text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-900/50 border-y border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Simple, Transparent Pricing</h2>
            <p className="text-xs text-slate-400">Start with our free plan. Upgrade as your business grows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl">
              <div>
                <h3 className="font-extrabold text-lg text-white">Starter</h3>
                <p className="text-xs text-slate-400">Free forever for solo creators</p>
                <div className="mt-4 text-3xl font-extrabold text-white">$0 <span className="text-xs font-medium text-slate-400">/ month</span></div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 1 Instagram Account</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 7-Day AI Content Plan</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Official Meta Scheduling</li>
              </ul>
              <button onClick={() => openAuthModal('signup')} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer">Start Free</button>
            </div>

            <div className="bg-slate-900 border-2 border-indigo-500 p-8 rounded-3xl space-y-6 shadow-2xl relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white font-extrabold text-[10px] uppercase rounded-full">
                Most Popular
              </span>
              <div>
                <h3 className="font-extrabold text-lg text-white">Pro Marketing</h3>
                <p className="text-xs text-slate-400">For growing small businesses</p>
                <div className="mt-4 text-3xl font-extrabold text-white">$29 <span className="text-xs font-medium text-slate-400">/ month</span></div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 3 Connected Accounts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Brand Voice Memory Engine</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> AI Weekly Performance Report</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Unlimited AI Regenerations</li>
              </ul>
              <button onClick={() => openAuthModal('signup')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer">Start 14-Day Free Trial</button>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl">
              <div>
                <h3 className="font-extrabold text-lg text-white">Agency</h3>
                <p className="text-xs text-slate-400">For agencies & multi-brand managers</p>
                <div className="mt-4 text-3xl font-extrabold text-white">$79 <span className="text-xs font-medium text-slate-400">/ month</span></div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 10 Connected Accounts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Custom AI Provider API Keys</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Dedicated Meta Developer Setup</li>
              </ul>
              <button onClick={() => openAuthModal('signup')} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="py-20 px-4 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about SocialPilot AI.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-white flex justify-between items-center cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-indigo-400 font-extrabold text-lg">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-slate-950 to-indigo-950/60 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready for your AI Marketing Manager?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Get your first personalized 7-day Instagram plan created and scheduled in under 3 minutes.
          </p>
          <button
            onClick={() => openAuthModal('signup')}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            Start Free Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
