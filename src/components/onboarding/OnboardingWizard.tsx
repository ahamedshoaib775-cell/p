import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { BusinessProfile } from '../../types';
import { Sparkles, Building2, Target, MapPin, Package, Award, Palette, Layers, ArrowRight, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';
import { InstagramIcon as Instagram } from '../common/InstagramIcon';

export const OnboardingWizard: React.FC = () => {
  const { business, completeOnboarding, addToast } = useApp();
  const [step, setStep] = useState<number>(1);

  const [formData, setFormData] = useState<BusinessProfile>({
    id: business?.id || `biz_${Date.now()}`,
    user_id: business?.user_id || 'usr_demo_1',
    business_name: business?.business_name || '',
    business_category: business?.business_category || 'Restaurant & Cafe',
    business_description: business?.business_description || '',
    location: business?.location || '',
    target_audience: business?.target_audience || '',
    products_services: business?.products_services || '',
    main_goal: business?.main_goal || 'Build brand awareness',
    brand_personality: business?.brand_personality || ['Professional', 'Friendly'],
    content_preferences: business?.content_preferences || ['Reels', 'Posts', 'Carousels', 'Educational'],
    brand_tone: business?.brand_tone || 'Professional & Friendly',
    brand_colors: business?.brand_colors || ['#2563eb', '#4f46e5', '#0f172a'],
    website_url: business?.website_url || '',
    instagram_username: business?.instagram_username || '@mybusiness',
    facebook_page: business?.facebook_page || '',
    posting_frequency: business?.posting_frequency || 'Once daily (7 posts / week)',
    logo_url: business?.logo_url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    onboarding_completed: false
  });

  const categories = [
    'Fashion',
    'Restaurant & Cafe',
    'Real Estate',
    'Fitness & Wellness',
    'Beauty & Salon',
    'Technology & SaaS',
    'Education',
    'Finance',
    'Professional Services',
    'E-commerce',
    'Other'
  ];

  const goals = [
    'Increase followers',
    'Generate leads',
    'Increase sales',
    'Build brand awareness',
    'Increase engagement',
    'Drive website traffic',
    'Launch a product'
  ];

  const personalities = [
    'Professional',
    'Friendly',
    'Premium',
    'Minimal',
    'Bold',
    'Funny',
    'Educational',
    'Inspirational',
    'Luxury',
    'Casual'
  ];

  const contentTypes = [
    'Reels',
    'Posts',
    'Carousels',
    'Stories',
    'Educational',
    'Promotional',
    'Behind the scenes',
    'Testimonials',
    'Tips',
    'FAQs',
    'Trends'
  ];

  const togglePersonality = (p: string) => {
    const current = formData.brand_personality || [];
    const next = current.includes(p) ? current.filter(x => x !== p) : [...current, p];
    setFormData({ ...formData, brand_personality: next });
  };

  const toggleContentPref = (c: string) => {
    const current = formData.content_preferences || [];
    const next = current.includes(c) ? current.filter(x => x !== c) : [...current, c];
    setFormData({ ...formData, content_preferences: next });
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    await completeOnboarding(formData);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans text-slate-100">
      <div className="max-w-2xl w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-fade-in">
        {/* Wizard Header Progress Bar */}
        <div className="bg-slate-900 border-b border-slate-800 p-6 sm:p-8 relative">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white block">SocialPilot AI Onboarding</span>
                <span className="text-xs text-slate-400">Step {step} of 10</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold">
              {Math.round((step / 10) * 100)}% Complete
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-300"
              style={{ width: `${(step / 10) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleFinish} className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: Business Name */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-400">
                <Building2 className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-white">What is your business name?</h3>
              </div>
              <p className="text-xs text-slate-400">
                Your AI Marketing Manager uses your real business name to generate tailored brand identity & captions.
              </p>
              <input
                type="text"
                required
                placeholder="e.g. Artisan Bloom Coffee"
                value={formData.business_name}
                onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* STEP 2: Business Description */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-400">
                <FileText className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-white">What does your business do?</h3>
              </div>
              <p className="text-xs text-slate-400">
                Describe your story, mission, or what makes your offerings special.
              </p>
              <textarea
                rows={4}
                required
                placeholder="We craft high-quality specialty coffees and fresh baked sourdough pastries daily for local coffee lovers..."
                value={formData.business_description}
                onChange={e => setFormData({ ...formData, business_description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* STEP 3: Business Category */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-400">
                <Layers className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-white">Select your Business Category</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, business_category: cat })}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      formData.business_category === cat
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-sm'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Target Audience */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-400">
                <Target className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-white">Who is your Target Audience?</h3>
              </div>
              <p className="text-xs text-slate-400">
                Who are your ideal customers or clients?
              </p>
              <input
                type="text"
                required
                placeholder="e.g. Local coffee lovers, remote workers, college students, busy professionals"
                value={formData.target_audience}
                onChange={e => setFormData({ ...formData, target_audience: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* STEP 5: Location / Market */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-400">
                <MapPin className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-white">Location / Target Market</h3>
              </div>
              <p className="text-xs text-slate-400">
                Where is your business located, or what region do you serve?
              </p>
              <input
                type="text"
                placeholder="e.g. Austin, TX (or Global / Online)"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* STEP 6: Products or Services */}
          {step === 6 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-400">
                <Package className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-white">Key Products or Services</h3>
              </div>
              <p className="text-xs text-slate-400">
                List your core products or services to feature in posts.
              </p>
              <input
                type="text"
                required
                placeholder="e.g. Cold brew, Espresso, Sourdough croissants, Private event catering"
                value={formData.products_services}
                onChange={e => setFormData({ ...formData, products_services: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* STEP 7: Main Marketing Goal */}
          {step === 7 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-400">
                <Award className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-white">Main Marketing Goal</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {goals.map((g, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, main_goal: g })}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      formData.main_goal === g
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-sm'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: Brand Personality (Multi-select) */}
          {step === 8 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-400">
                <Palette className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-white">Brand Personality (Select multiple)</h3>
              </div>
              <p className="text-xs text-slate-400">Choose all tones that match your business brand voice.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {personalities.map((p, idx) => {
                  const isSelected = (formData.brand_personality || []).includes(p);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => togglePersonality(p)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-sm'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{p}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 9: Content Preferences (Multi-select) */}
          {step === 9 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-400">
                <Layers className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-white">Content Preferences (Select multiple)</h3>
              </div>
              <p className="text-xs text-slate-400">Select content formats you want in your 7-day calendar.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {contentTypes.map((c, idx) => {
                  const isSelected = (formData.content_preferences || []).includes(c);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleContentPref(c)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-sm'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 10: Connect Instagram Account */}
          {step === 10 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-indigo-400">
                <Instagram className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-white">Connect Instagram Professional Account</h3>
              </div>
              <p className="text-xs text-slate-400">
                Connect using official Meta OAuth to automatically schedule & publish approved content.
              </p>

              <div className="p-5 bg-slate-800/60 border border-slate-700 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    IG
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">@{formData.business_name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'businessname'}</h4>
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Ready for Meta OAuth Connection
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addToast('success', 'Connected Instagram Professional Account via Meta OAuth!')}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Connect Instagram
                </button>
              </div>

              <div className="p-3 bg-slate-800/30 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                🔒 Official Meta Graph APIs only. SocialPilot AI never asks for your password or uses browser scraping.
              </div>
            </div>
          )}

          {/* Wizard Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {step < 10 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !formData.business_name) {
                    addToast('error', 'Please enter your Business Name');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                Complete Onboarding & Create Plan
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
