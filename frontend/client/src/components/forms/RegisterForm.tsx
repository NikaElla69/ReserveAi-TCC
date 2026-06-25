/**
 * Register form focused on helping people create an account quickly and start booking restaurants.
 */

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { registerSchema, type RegisterFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      nome: '',
      email: '',
      cpf: '',
      senha: '',
      confirmarSenha: '',
      papel: 'CUSTOMER'
    }
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setIsLoading(true);

    try {
      await register({
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        senha: data.senha,
        papel: data.papel.toUpperCase() as 'CUSTOMER' | 'OWNER' | 'ADMIN'
      });
      toast.success('Conta criada com sucesso! Agora você já pode explorar restaurantes e reservar sua mesa.');
      navigate('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar a conta';
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
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="João Silva" disabled={isLoading} autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" type="email" disabled={isLoading} autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="000.000.000-00" disabled={isLoading} autoComplete="off" {...field} />
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
                    autoComplete="new-password"
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
              <p className="mt-1 text-xs text-gray-500">Use pelo menos 8 caracteres, incluindo letra maiúscula e número.</p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmarSenha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="••••••••"
                    type={mostrarConfirmacao ? 'text' : 'password'}
                    disabled={isLoading}
                    autoComplete="new-password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {mostrarConfirmacao ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="papel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de conta</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de conta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Cliente</SelectItem>
                  <SelectItem value="OWNER">Proprietário de restaurante</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
              <p className="mt-1 text-xs text-gray-500">
                {field.value === 'CUSTOMER' && 'Ideal para descobrir restaurantes e fazer reservas.'}
                {field.value === 'OWNER' && 'Ideal para gerenciar o perfil do seu restaurante e acompanhar reservas.'}
                {field.value === 'ADMIN' && 'Ideal para supervisão operacional e gerenciamento da plataforma.'}
              </p>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar conta'
          )}
        </Button>
      </form>
    </Form>
  );
}
