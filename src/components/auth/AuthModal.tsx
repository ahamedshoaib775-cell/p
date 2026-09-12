import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Lock, Mail, User, ArrowRight, X } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, signup, resetPassword } = useApp();

  const [email, setEmail] = useState('owner@artisanbloom.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Morgan');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (authModalTab === 'login') {
        await login(email);
      } else if (authModalTab === 'signup') {
        await signup(email, name);
      } else {
        await resetPassword(email);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden text-slate-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">SocialPilot AI</span>
          </div>

          <p className="text-xs text-slate-300">
            {authModalTab === 'login' && 'Welcome back! Sign in to your AI Marketing Manager.'}
            {authModalTab === 'signup' && 'Create your account to start your 7-day AI social plan.'}
            {authModalTab === 'reset' && 'Reset your password instructions.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
              authModalTab === 'login' ? 'border-indigo-600 text-indigo-600 bg-white font-extrabold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => openAuthModal('signup')}
            className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
              authModalTab === 'signup' ? 'border-indigo-600 text-indigo-600 bg-white font-extrabold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {authModalTab === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="owner@yourbusiness.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {authModalTab !== 'reset' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                {authModalTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('reset')}
                    className="text-xs text-indigo-600 hover:underline font-medium cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                {authModalTab === 'login' && 'Sign In'}
                {authModalTab === 'signup' && 'Get Started Free'}
                {authModalTab === 'reset' && 'Send Reset Link'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo Login Preset */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">Or test out-of-the-box:</span>
            <button
              type="button"
              onClick={() => {
                setEmail('owner@artisanbloom.com');
                login('owner@artisanbloom.com');
              }}
              className="mt-1 block w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              🚀 One-Click Demo Owner Sign-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
