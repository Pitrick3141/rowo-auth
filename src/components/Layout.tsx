import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, UserCheck, ShieldAlert, Info, HelpCircle, Github } from 'lucide-react';
import { clsx } from 'clsx';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Query', icon: ShieldCheck },
    { path: '/verify', label: 'Verify Identity', icon: UserCheck },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={__ICON_URL__} alt="ROwO Auth Logo" className="w-8 h-8 rounded-xl" referrerPolicy="no-referrer" />
            <span className="font-semibold text-lg tracking-tight text-slate-800">ROwO Auth</span>
          </div>
          <nav className="flex gap-1 items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            <a
              href="https://github.com/Pitrick3141/rowo-auth"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="flex items-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} PiTrick Technology. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
