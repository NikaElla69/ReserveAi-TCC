/**
 * Design philosophy for not-found states: even wrong turns should feel intentional, with a graceful route back into the experience.
 */
import { ArrowLeft, Compass, Home, Sparkles, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="min-h-[calc(100vh-12rem)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16 flex items-center">
      <div className="mx-auto max-w-4xl w-full">
        {/* Decorative elements */}
        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#f0d1a2]/10 to-transparent rounded-full -translate-y-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#8b5e34]/5 to-transparent rounded-full translate-y-1/4 blur-3xl pointer-events-none" />
          
          <div className="glass-panel relative rounded-[2.5rem] p-8 sm:p-12 lg:p-16 shadow-[0_20px_65px_rgba(75,46,25,0.10)]">
            {/* 404 Illustration */}
            <div className="relative mb-8">
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                {/* Prato decorativo */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-dashed border-[#e9dccb] flex items-center justify-center animate-spin-slow">
                    <UtensilsCrossed className="w-10 h-10 sm:w-12 sm:h-12 text-[#8b5e34] opacity-50" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#8b5e34] animate-pulse" />
                  </div>
                </div>

                {/* Número 404 */}
                <div className="text-center">
                  <div className="relative">
                    <span className="text-7xl sm:text-8xl lg:text-9xl font-display font-bold bg-gradient-to-br from-[#26170f] via-[#4a3720] to-[#8b5e34] bg-clip-text text-transparent">
                      404
                    </span>
                    <div className="absolute -top-4 -right-4 sm:-right-6">
                      <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#f0d1a2] animate-pulse" />
                    </div>
                  </div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#8b5e34] font-medium mt-2">
                    Página não encontrada
                  </p>
                </div>

                {/* Garfo decorativo */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-dashed border-[#e9dccb] flex items-center justify-center animate-spin-slow animation-delay-2000">
                    <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-[#8b5e34] opacity-50" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#8b5e34] animate-pulse animation-delay-1000" />
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="text-center space-y-4 mb-10">
              <h1 className="font-display text-4xl sm:text-5xl text-[#26170f] leading-tight">
                Ops! Esta página{' '}
                <span className="bg-gradient-to-r from-[#8b5e34] to-[#c8944a] bg-clip-text text-transparent">
                  saiu do cardápio
                </span>
              </h1>
              <p className="mx-auto max-w-xl text-sm sm:text-base leading-7 text-[#6b5647]">
                Parece que o caminho que você procura não está mais disponível. Mas não se preocupe, ainda há muitos restaurantes esperando por você!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] px-8 py-4 text-white font-semibold shadow-lg shadow-[#8b5e34]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#8b5e34]/30 hover:scale-[1.02] active:scale-[0.98]"
                to="/"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Home className="h-5 w-5" />
                Voltar ao início
                <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
              
              <Link 
                className="group flex items-center justify-center gap-2 rounded-2xl border-2 border-[#e9dccb] bg-white/80 px-8 py-4 text-[#4a2512] font-medium backdrop-blur-sm transition-all duration-300 hover:border-[#8b5e34]/60 hover:bg-[#f8f0e2] hover:shadow-lg active:scale-[0.98]"
                to="/reservations"
              >
                <UtensilsCrossed className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                Ver minhas reservas
              </Link>
            </div>

            {/* Helpful links */}
            <div className="mt-10 pt-8 border-t border-[#e9dccb]">
              <p className="text-center text-sm text-[#6b5647] mb-4">
                Talvez você esteja procurando por:
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-xl bg-[#f8f0e2] text-[#8b5e34] hover:bg-[#f0e6d8] transition-colors duration-200 font-medium"
                >
                  Fazer login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-xl bg-[#f8f0e2] text-[#8b5e34] hover:bg-[#f0e6d8] transition-colors duration-200 font-medium"
                >
                  Criar conta
                </Link>
                <Link 
                  to="/" 
                  className="px-4 py-2 rounded-xl bg-[#f8f0e2] text-[#8b5e34] hover:bg-[#f0e6d8] transition-colors duration-200 font-medium"
                >
                  Explorar restaurantes
                </Link>
              </div>
            </div>

            {/* Fun fact */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fef9f0] border border-[#f0e6d8]">
                <Sparkles className="h-3.5 w-3.5 text-[#f0d1a2]" />
                <p className="text-xs text-[#8b5e34]">
                  <span className="font-semibold">Curiosidade:</span> O erro 404 existe desde 1992!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adicione estas animações ao seu CSS global */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}