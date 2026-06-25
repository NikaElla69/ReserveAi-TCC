/**
 * Design philosophy for the header: pair editorial refinement with clear role-aware wayfinding, keeping each user close to their primary actions.
 */
import { 
  Menu, 
  UserRound, 
  X, 
  Sparkles, 
  LogOut, 
  ChevronRight,
  Store,
  LayoutDashboard,
  Settings,
  CalendarCheck
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getNavigationByRole } from '@/lib/role-routing';

const navLinkBase = 
  'relative text-sm font-medium tracking-[0.04em] text-[#5d4738] transition-all duration-300 hover:text-[#1f140d] py-2 px-3 rounded-xl hover:bg-[#f8f0e2]';

const navLinkActive = 
  'relative text-sm font-medium tracking-[0.04em] text-[#8b5e34] transition-all duration-300 py-2 px-3 rounded-xl bg-[#f8f0e2] font-semibold';

export function SiteHeader() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { to: '/', label: 'Início' },
        { to: '/restaurants', label: 'Restaurantes' },
        { to: '/register', label: 'Cadastro' }
      ];
    }

    return getNavigationByRole(user?.papel);
  }, [isAuthenticated, user?.papel]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  // Links rápidos para usuários autenticados
  const quickLinks = useMemo(() => {
    if (!isAuthenticated || !user) return [];
    
    if (user.papel === 'OWNER') {
      return [
        { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/owner/restaurant', label: 'Restaurante', icon: Store },
      ];
    }
    
    if (user.papel === 'ADMIN') {
      return [
        { to: '/admin/dashboard', label: 'Admin', icon: LayoutDashboard },
      ];
    }
    
    return [
      { to: '/reservations', label: 'Minhas Reservas', icon: CalendarCheck },
    ];
  }, [isAuthenticated, user]);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-[#e9dccb] bg-white/90 px-4 py-3 shadow-[0_18px_50px_rgba(66,42,25,0.06)] backdrop-blur-xl sm:px-6">
        {/* Logo */}
        <Link className="flex items-center gap-3 group" to="/">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a0f0a] to-[#2c1a12] font-display text-lg text-[#f0d1a2] shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
            <span className="relative z-10 font-bold">R</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#f0d1a2]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-xl leading-none text-[#26170f]">ReserveAí</p>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8b5e34] font-medium">Reservas inteligentes</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to}
              className={({ isActive }) => isActive ? navLinkActive : navLinkBase}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              {/* Quick Links */}
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#5d4738] hover:bg-[#f8f0e2] hover:text-[#26170f] transition-all duration-300"
                >
                  <link.icon className="h-4 w-4 text-[#8b5e34]" />
                  {link.label}
                </Link>
              ))}
              
              {/* User Menu */}
              <div className="flex items-center gap-2 rounded-xl border border-[#e9dccb] bg-[#fef9f0] pl-3 pr-1.5 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5e34]/20 to-[#c8944a]/10 flex items-center justify-center">
                    <UserRound className="h-4 w-4 text-[#8b5e34]" />
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-sm font-medium text-[#26170f] leading-tight">{user?.nome?.split(' ')[0]}</p>
                    <p className="text-xs text-[#8b5e34] capitalize">{user?.papel?.toLowerCase()}</p>
                  </div>
                </div>
                
                <button 
                  className="p-1.5 rounded-lg hover:bg-red-50 text-[#8b5e34] hover:text-red-600 transition-all duration-300"
                  onClick={handleLogout} 
                  type="button"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                className="flex items-center gap-1.5 rounded-xl border-2 border-[#e9dccb] px-5 py-2.5 text-sm font-medium text-[#4b382a] hover:border-[#8b5e34]/50 hover:bg-[#f8f0e2] transition-all duration-300"
                to="/login"
              >
                Entrar
              </Link>
              <Link 
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#8b5e34]/20 hover:shadow-xl hover:shadow-[#8b5e34]/30 hover:scale-[1.02] transition-all duration-300"
                to="/register"
              >
                <Sparkles className="h-4 w-4" />
                Criar conta
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#e9dccb] bg-[#fef9f0] text-[#26170f] hover:border-[#8b5e34]/50 hover:bg-[#f8f0e2] transition-all duration-300 lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen ? (
        <div className="mx-auto mt-3 max-w-7xl rounded-2xl border border-[#e9dccb] bg-white/95 p-6 shadow-[0_18px_50px_rgba(66,42,25,0.08)] backdrop-blur-xl lg:hidden animate-in slide-in-from-top-2 duration-300">
          {/* User Info (if authenticated) */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#f0e6d8]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5e34]/20 to-[#c8944a]/10 flex items-center justify-center">
                <UserRound className="h-6 w-6 text-[#8b5e34]" />
              </div>
              <div>
                <p className="font-semibold text-[#26170f]">{user.nome}</p>
                <p className="text-sm text-[#8b5e34] capitalize">{user.papel?.toLowerCase()}</p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 mb-4">
            {navigation.map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#f8f0e2] text-[#8b5e34]' 
                      : 'text-[#5d4738] hover:bg-[#f8f0e2] hover:text-[#26170f]'
                  }`
                }
              >
                {item.label}
                <ChevronRight className="h-4 w-4 opacity-40" />
              </NavLink>
            ))}
          </nav>

          {/* Quick Links (if authenticated) */}
          {isAuthenticated && quickLinks.length > 0 && (
            <div className="flex flex-col gap-1 mb-4 pb-4 border-b border-[#f0e6d8]">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#5d4738] hover:bg-[#f8f0e2] transition-all duration-300"
                >
                  <link.icon className="h-4 w-4 text-[#8b5e34]" />
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <button 
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300"
                onClick={handleLogout} 
                type="button"
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </button>
            ) : (
              <>
                <Link 
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#e9dccb] px-5 py-3 text-sm font-medium text-[#4b382a] hover:border-[#8b5e34]/50 hover:bg-[#f8f0e2] transition-all duration-300"
                  onClick={() => setIsOpen(false)} 
                  to="/login"
                >
                  Entrar
                </Link>
                <Link 
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[#8b5e34]/20 hover:shadow-xl hover:shadow-[#8b5e34]/30 transition-all duration-300"
                  onClick={() => setIsOpen(false)} 
                  to="/register"
                >
                  <Sparkles className="h-4 w-4" />
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}