import React from 'react';
import { Code2, ExternalLink, Globe, Heart, Mail, ShieldCheck, UserCheck } from 'lucide-react';
import { AppSettings } from '../types/physics';

interface AboutDeveloperCardProps {
  settings: AppSettings;
  onOpenSettings?: () => void;
}

export const AboutDeveloperCard: React.FC<AboutDeveloperCardProps> = ({
  settings,
  onOpenSettings,
}) => {
  const name = settings.developerName?.trim() || 'Kushal';
  const bio =
    settings.developerBio?.trim() ||
    'Class 12 JEE Aspirant & Full-Stack Creator building high-performance study tools for aspirants.';
  const portfolio = settings.developerPortfolio?.trim() || '';
  const email = settings.developerEmail?.trim() || 'kushalkj2009@gmail.com';

  return (
    <div className="rounded-2xl border border-cyan-500/35 studio-surface p-5 space-y-3.5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <Code2 className="h-5 w-5 text-cyan-500" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-cyan-600 dark:text-cyan-400">
              App Developer & Creator
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {name}
            </h3>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          <span>Verified Author</span>
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {bio}
      </p>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {email && (
          <a
            href={`mailto:${email}`}
            className="min-h-[38px] px-3.5 rounded-xl border border-cyan-500/35 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>{email}</span>
          </a>
        )}

        {portfolio && (
          <a
            href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[38px] px-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Portfolio</span>
            <ExternalLink className="h-3 w-3 opacity-75" />
          </a>
        )}

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="min-h-[38px] px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 hover:border-cyan-400 transition-colors cursor-pointer sm:ml-auto"
          >
            <UserCheck className="h-3.5 w-3.5 text-cyan-500" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-1">
        <span>Built with</span>
        <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
        <span>for JEE Main Aspirants. Ask mentor: &quot;Who developed this app?&quot; or &quot;What is developer email?&quot;</span>
      </div>
    </div>
  );
};
