import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { userRepository } from '../repositories/user.repository';
import { AppError } from '../utils/app-error';
import { env } from '../config/env';

export interface CreateUserServiceInput {
  tenantId?: string | null;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  senha: string;
  papel?: UserRole;
}

export interface UpdateUserServiceInput {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  senha?: string;
  papel?: UserRole;
  ativo?: boolean;
}

export class UserService {
  async list() {
    return userRepository.list();
  }

  async getById(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    return user;
  }

  async create(input: CreateUserServiceInput) {
    const exists = await userRepository.existsByEmailOrCpf(input.email, input.cpf);

    if (exists) {
      throw new AppError('Já existe um usuário com este e-mail ou CPF.', 409);
    }

    const senhaHash = await bcrypt.hash(input.senha, env.bcryptSaltRounds);

    return userRepository.create({
      tenantId: input.tenantId,
      nome: input.nome,
      email: input.email,
      cpf: input.cpf,
      telefone: input.telefone,
      senhaHash,
      papel: input.papel ?? UserRole.CUSTOMER,
    });
  }

  async update(id: string, input: UpdateUserServiceInput) {
    await this.getById(id);

    if (input.email || input.cpf) {
      const current = await this.getById(id);
      const exists = await userRepository.existsByEmailOrCpf(input.email ?? current.email, input.cpf ?? current.cpf, id);

      if (exists) {
        throw new AppError('Já existe outro usuário com este e-mail ou CPF.', 409);
      }
    }

    const senhaHash = input.senha ? await bcrypt.hash(input.senha, env.bcryptSaltRounds) : undefined;

    return userRepository.update(id, {
      nome: input.nome,
      email: input.email,
      cpf: input.cpf,
      telefone: input.telefone,
      senhaHash,
      papel: input.papel,
      ativo: input.ativo,
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return userRepository.delete(id);
  }

  async reservationHistory(id: string) {
    await this.getById(id);
    return userRepository.getReservationHistory(id);
  }
}

export const userService = new UserService();
