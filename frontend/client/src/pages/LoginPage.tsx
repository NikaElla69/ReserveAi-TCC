/**
 * Design philosophy for login: turn authentication into a calm, guided checkpoint with clarity about API integration.
 */
import { Sparkles } from 'lucide-react';
import { AuthSplitLayout } from '@/components/forms/AuthSplitLayout';
import { LoginForm } from '@/components/forms/LoginForm';

export function LoginPage() {
  return (
    <section className="min-h-[calc(100vh-8rem)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12 flex items-center">
      <div className="mx-auto max-w-7xl w-full">
        <div className="relative">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-[#f0d1a2]/10 to-transparent rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#8b5e34]/5 to-transparent rounded-full translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          
          <AuthSplitLayout
            alternateAction="Criar conta gratuita"
            alternateHref="/register"
            alternateLabel="Ainda não possui conta?"
            description="Entre para acompanhar suas reservas, consultar restaurantes e organizar seus próximos encontros à mesa com praticidade."
            eyebrow={
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#f0d1a2] animate-pulse" />
                Acesse sua conta
              </span>
            }
            title={
              <span>
                Bem-vindo de{' '}
                <span className="bg-gradient-to-r from-[#8b5e34] to-[#c8944a] bg-clip-text text-transparent">
                  volta
                </span>
              </span>
            }
          >
            <LoginForm />
          </AuthSplitLayout>
        </div>
      </div>
    </section>
  );
}