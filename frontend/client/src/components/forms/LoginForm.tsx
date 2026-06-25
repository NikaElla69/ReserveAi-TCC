/**
 * Login form focused on helping users return quickly to the area that matters most for their role.
 */

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, type LoginFormData } from '@/lib/validation';
import { getDefaultRouteByRole } from '@/lib/role-routing';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Loader2, Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: '',
      senha: ''
    }
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);

    try {
      const user = await login(data);

      toast.success('Login realizado com sucesso!');
      navigate(getDefaultRouteByRole(user.papel));
    } catch (error) {
      console.error(error);

      const message = error instanceof Error ? error.message : 'Erro ao fazer login';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>

              <FormControl>
                <Input
                  placeholder="seu@email.com"
                  type="email"
                  disabled={isLoading}
                  autoComplete="email"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="senha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>

              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="••••••••"
                    type={mostrarSenha ? 'text' : 'password'}
                    disabled={isLoading}
                    autoComplete="current-password"
                    {...field}
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>
      </form>
    </Form>
  );
}
