import { Prisma } from '@prisma/client';
import { restaurantRepository } from '../repositories/restaurant.repository';
import { AppError } from '../utils/app-error';

export interface CreateRestaurantServiceInput {
  tenantId: string;
  proprietarioId: string;
  nome: string;
  descricao?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco: string;
  cidade: string;
  estado: string;
  cep?: string | null;
  logo?: string | null;
  bannerPrincipal?: string | null;
  capacidade: number;
  horarioFuncionamento: Prisma.InputJsonValue;
  politicaReservas?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  slug: string;
  dominioPersonalizado?: string | null;
}

export interface UpdateRestaurantServiceInput
  extends Partial<CreateRestaurantServiceInput> {
  ativo?: boolean;
}

export class RestaurantService {
  async listPublic(filters?: { cidade?: string; termo?: string }) {
    return restaurantRepository.listPublic(filters);
  }

  async listByOwner(ownerId: string) {
    return restaurantRepository.listByOwner(ownerId);
  }

  async getById(id: string) {
    const restaurant = await restaurantRepository.findById(id);

    if (!restaurant) {
      throw new AppError('Restaurante não encontrado.', 404);
    }

    return restaurant;
  }

  async getBySlug(slug: string) {
    const restaurant = await restaurantRepository.findBySlug(slug);

    if (!restaurant) {
      throw new AppError('Restaurante não encontrado.', 404);
    }

    return restaurant;
  }

  
  async create(input: CreateRestaurantServiceInput) {

    console.log('DADOS QUE CHEGARAM NO SERVICE');
    console.log(input);

    const horarioFuncionamento =
      input.horarioFuncionamento ?? {
        segunda: "08:00-22:00",
        terca: "08:00-22:00",
        quarta: "08:00-22:00",
        quinta: "08:00-22:00",
        sexta: "08:00-23:00",
        sabado: "08:00-23:00",
        domingo: "08:00-22:00",
      };

    return restaurantRepository.create({
      ...input,
      horarioFuncionamento,
    });
  }

  async update(id: string, input: UpdateRestaurantServiceInput) {
    await this.getById(id);

    return restaurantRepository.update(id, {
      ...input,
      horarioFuncionamento:
        input.horarioFuncionamento as Prisma.InputJsonValue,
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return restaurantRepository.delete(id);
  }

  async availability(
    restaurantId: string,
    dataReserva: Date,
    horarioReserva: Date,
    quantidadePessoas: number
  ) {
    await this.getById(restaurantId);

    return restaurantRepository.findAvailability(
      restaurantId,
      dataReserva,
      horarioReserva,
      quantidadePessoas
    );
  }
}

export const restaurantService = new RestaurantService();