import { TableStatus } from '@prisma/client';
import { tableRepository } from '../repositories/table.repository';
import { AppError } from '../utils/app-error';

export interface CreateTableServiceInput {
  restauranteId: string;
  numero: string;
  capacidade: number;
  status?: TableStatus;
  localizacao?: string;
}

export interface UpdateTableServiceInput {
  numero?: string;
  capacidade?: number;
  status?: TableStatus;
  localizacao?: string;
  ativo?: boolean;
}

export class TableService {
  async listByRestaurant(restauranteId: string) {
    return tableRepository.listByRestaurant(restauranteId);
  }

  async getById(id: string) {
    const table = await tableRepository.findById(id);

    if (!table) {
      throw new AppError('Mesa não encontrada.', 404);
    }

    return table;
  }

  async create(input: CreateTableServiceInput) {
    const existing = await tableRepository.findByNumber(input.restauranteId, input.numero);

    if (existing) {
      throw new AppError('Já existe uma mesa com este número no restaurante.', 409);
    }

    return tableRepository.create(input);
  }

  async update(id: string, input: UpdateTableServiceInput) {
    const current = await this.getById(id);

    if (input.numero) {
      const existing = await tableRepository.findByNumber(current.restauranteId, input.numero, id);

      if (existing) {
        throw new AppError('Já existe uma mesa com este número no restaurante.', 409);
      }
    }

    return tableRepository.update(id, input);
  }

  async delete(id: string) {
    await this.getById(id);
    return tableRepository.delete(id);
  }
}

export const tableService = new TableService();
