/**
 * AuthSplitLayout Premium
 * Layout dividido para páginas de autenticação com design refinado
 */
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { imagery } from '@/lib/assets';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  description: string;
  eyebrow: React.ReactNode;
  alternateLabel: string;
  alternateAction: string;
  alternateHref: string;
}

export function AuthSplitLayout({
  children,
  title,
  description,
  eyebrow,
  alternateLabel,
  alternateAction,
  alternateHref
}: AuthSplitLayoutProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
      {/* Left Column - Visual/Info */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1a0f0a] via-[#261912] to-[#1a0f0a] p-8 sm:p-10 lg:p-12 min-h-[32rem] flex flex-col justify-between">
        {/* Decorative patterns */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTIwIDIwTDAgMjBsMjAgMjB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#f0d1a2]/10 to-transparent rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#8b5e34]/10 to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />
        
        {/* Content */}
        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f0d1a2]/20 bg-white/5 backdrop-blur-sm px-4 py-2">
            <Sparkles className="h-4 w-4 text-[#f0d1a2] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#f0d1a2] font-medium">ReserveAí</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
              {title}
            </h1>
            <p className="text-base leading-8 text-white/72 max-w-lg">
              {description}
            </p>
          </div>
        </div>

        {/* Bottom card */}
        <div className="relative">
          <div className="glass-dark rounded-[1.8rem] p-6 border border-white/10 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f0d1a2]/20 to-[#d4a24e]/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#f0d1a2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-white">
                <p className="font-semibold text-lg mb-1">Seus dados protegidos</p>
                <p className="text-sm text-white/60 leading-relaxed">
                  Autenticação segura e criptografada. Suas informações pessoais e reservas estão protegidas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="space-y-6">
        {/* Mobile-only header */}
        <div className="lg:hidden space-y-3 mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34] font-medium">{eyebrow}</p>
          <h2 className="font-display text-3xl text-[#26170f]">{title}</h2>
          <p className="text-sm leading-7 text-[#6b5647]">{description}</p>
        </div>

        {/* Form card */}
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-[0_20px_65px_rgba(75,46,25,0.08)]">
          <div className="hidden lg:block space-y-3 mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34] font-medium">{eyebrow}</p>
            <h2 className="font-display text-3xl text-[#26170f]">{title}</h2>
          </div>
          
          {children}
        </div>

        {/* Alternate action link */}
        <div className="text-center">
          <p className="text-sm text-[#6b5647]">
            {alternateLabel}{' '}
            <Link
              to={alternateHref}
              className="group inline-flex items-center gap-1 font-semibold text-[#8b5e34] hover:text-[#6b3a2a] transition-colors duration-300"
            >
              {alternateAction}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </p>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 text-xs text-[#8b5e34]/50">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            SSL Criptografado
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Dados Protegidos
          </span>
        </div>
      </div>
    </div>
  );
}