/**
 * Design philosophy for the footer: close the experience with warmth, guidance and practical reminders.
 */
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowUpRight, 
  Sparkles,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Heart,
  Shield,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[#f0d1a2]/30 to-transparent" />
      
      <div className="mx-auto max-w-7xl">
        {/* Main Footer Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#3d2a1a] bg-gradient-to-br from-[#1a0f0a] via-[#241610] to-[#1a0f0a] px-6 py-10 sm:px-8 lg:px-12 shadow-[0_30px_80px_rgba(30,18,10,0.35)]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#f0d1a2]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#8b5e34]/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMTUiPjxwYXRoIGQ9Ik0zNiAxOGMwLTQuNC0zLjYtOC04LTgtcy04IDMuNi04IDggMy42IDggOCA4IDgtMy42IDgtOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30 pointer-events-none" />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr_1fr] lg:gap-12">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#f0d1a2]/20 bg-white/5 backdrop-blur-sm px-4 py-2">
                  <Sparkles className="h-4 w-4 text-[#f0d1a2] animate-pulse" />
                  <span className="text-xs uppercase tracking-[0.3em] text-[#f0d1a2] font-medium">ReserveAí</span>
                </div>
                
                <h2 className="font-display text-3xl text-white leading-tight">
                  Transforme a gestão de{' '}
                  <span className="bg-gradient-to-r from-[#f0d1a2] to-[#c8944a] bg-clip-text text-transparent">
                    reservas
                  </span>
                </h2>
                
                <p className="text-sm leading-7 text-white/60 max-w-sm">
                  O sistema mais completo para gerenciar reservas do seu restaurante com praticidade e elegância.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {[
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Youtube, href: '#', label: 'Youtube' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-[#f0d1a2]/30 transition-all duration-300 group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-[0.2em]">
                Links Rápidos
              </h3>
              <nav className="grid gap-2">
                {[
                  { label: 'Explorar restaurantes', to: '/restaurants' },
                  { label: 'Minhas reservas', to: '/reservations' },
                  { label: 'Meu perfil', to: '/profile' },
                  { label: 'Criar conta', to: '/register' },
                  { label: 'Fazer login', to: '/login' },
                ].map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex items-center gap-2 text-sm text-white/50 hover:text-[#f0d1a2] transition-all duration-300 py-1.5"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-[#f0d1a2]/50 transition-all duration-300" />
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-[0.2em]">
                Contato
              </h3>
              
              <div className="grid gap-3">
                {/* Phone */}
                <div className="group rounded-[1.25rem] border border-white/8 bg-white/5 p-4 hover:bg-white/10 hover:border-[#f0d1a2]/20 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#f0d1a2]/20 to-[#d4a24e]/10 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-[#f0d1a2]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Telefone</p>
                      <p className="text-sm text-white/60 mt-0.5">(11) 99999-9999</p>
                      <p className="flex items-center gap-1.5 text-xs text-white/40 mt-1">
                        <Clock className="h-3 w-3" />
                        Seg a Sex: 9h às 18h
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="group rounded-[1.25rem] border border-white/8 bg-white/5 p-4 hover:bg-white/10 hover:border-[#f0d1a2]/20 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#f0d1a2]/20 to-[#d4a24e]/10 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-[#f0d1a2]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">E-mail</p>
                      <p className="text-sm text-white/60 mt-0.5">contato@reserveai.com.br</p>
                      <p className="flex items-center gap-1.5 text-xs text-white/40 mt-1">
                        <Zap className="h-3 w-3" />
                        Respondemos em até 24h
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="group rounded-[1.25rem] border border-white/8 bg-white/5 p-4 hover:bg-white/10 hover:border-[#f0d1a2]/20 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#f0d1a2]/20 to-[#d4a24e]/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-[#f0d1a2]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Endereço</p>
                      <p className="text-sm text-white/60 mt-0.5">Av. Paulista, 1000 - Sala 101</p>
                      <p className="text-xs text-white/40 mt-1">São Paulo - SP • CEP: 01310-100</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative mt-10 pt-6 border-t border-white/8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
              <p>
                © {currentYear} ReserveAí. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                <span>Seus dados estão seguros com criptografia SSL</span>
              </div>
              <p className="flex items-center gap-1">
                Feito com <Heart className="h-3 w-3 text-red-400 fill-red-400 animate-pulse" /> para restaurantes incríveis
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}