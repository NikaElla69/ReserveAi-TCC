/**
 * Owner Service
 * Serviço para operações do proprietário de restaurante
 */

import { api } from './api';

export const ownerService = {
  /**
   * Obter dashboard do proprietário
   */
  async getDashboard() {
    const response = await api.get('/owner/dashboard');
    return response.data;
  },

  /**
   * Obter detalhes de um restaurante
   */
  async getRestaurantDetails(restaurantId: string) {
    const response = await api.get(`/owner/restaurants/${restaurantId}`);
    return response.data.data;
  },

  /**
   * Listar reservas de um restaurante
   */
  async listReservations(restaurantId: string, filters?: any) {
    const response = await api.get(`/owner/restaurants/${restaurantId}/reservations`, {
      params: filters
    });
    return response.data.data;
  },

  /**
   * Confirmar reserva
   */
  async confirmReservation(reservationId: string) {
    const response = await api.put(`/owner/reservations/${reservationId}/confirm`);
    return response.data;
  },

  /**
   * Rejeitar reserva
   */
  async rejectReservation(reservationId: string, justificativa: string) {
    const response = await api.put(`/owner/reservations/${reservationId}/reject`, {
      justificativa
    });
    return response.data;
  },

  /**
   * Obter estatísticas de ocupação
   */
  async getOccupancyStats(restaurantId: string, period?: string) {
    const response = await api.get(`/owner/restaurants/${restaurantId}/occupancy-stats`, {
      params: { period }
    });
    return response.data;
  },

  /**
   * Obter mesas disponíveis
   */
  async getAvailableTables(restaurantId: string, data: string, horario: string, quantidadePessoas: number) {
    const response = await api.get(`/owner/restaurants/${restaurantId}/available-tables`, {
      params: { data, horario, quantidadePessoas }
    });
    return response.data.data;
  }
};
