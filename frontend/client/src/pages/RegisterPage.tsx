/**
 * Design philosophy for registration: welcome new diners with clarity, making each field feel intentional and beginner-friendly.
 */
import { Sparkles, Gift, Star } from 'lucide-react';
import { AuthSplitLayout } from '@/components/forms/AuthSplitLayout';
import { RegisterForm } from '@/components/forms/RegisterForm';

export function RegisterPage() {
  return (
    <section className="min-h-[calc(100vh-8rem)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12 flex items-center">
      <div className="mx-auto max-w-7xl w-full">
        <div className="relative">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-[#f0d1a2]/10 to-transparent rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#8b5e34]/5 to-transparent rounded-full translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          
          <AuthSplitLayout
            alternateAction="Fazer login"
            alternateHref="/login"
            alternateLabel="Já possui conta?"
            description="Crie sua conta para pesquisar restaurantes, consultar disponibilidade e realizar reservas de forma rápida e segura."
            eyebrow={
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#f0d1a2] animate-pulse" />
                Cadastro
              </span>
            }
            title={
              <span>
                Comece sua{' '}
                <span className="bg-gradient-to-r from-[#f0d1a2] to-[#c8944a] bg-clip-text text-transparent">
                  jornada gastronômica
                </span>
              </span>
            }
          >
            <RegisterForm />
          </AuthSplitLayout>
        </div>
      </div>
    </section>
  );
}