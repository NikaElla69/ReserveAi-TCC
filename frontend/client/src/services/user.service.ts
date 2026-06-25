/**
 * Design philosophy for user services: keep account-related operations explicit so the interface can remain composed and understandable for beginners.
 */
import { api } from '@/services/api';
import type { ApiEnvelope, Reservation, User } from '@/types/api';

export const userService = {
  async list() {
    const response = await api.get<ApiEnvelope<User[]>>('/users');
    return response.data.data;
  },

  async getById(id: string) {
    const response = await api.get<ApiEnvelope<User>>(`/users/${id}`);
    return response.data.data;
  },

  async update(id: string, payload: Partial<Pick<User, 'nome' | 'email' | 'cpf' | 'papel'>>) {
    const response = await api.put<ApiEnvelope<User>>(`/users/${id}`, payload);
    return response.data.data;
  },

  async remove(id: string) {
    const response = await api.delete<ApiEnvelope<{ success: boolean }>>(`/users/${id}`);
    return response.data;
  },

  async reservationHistory(id: string) {
    const response = await api.get<ApiEnvelope<Reservation[]>>(`/users/${id}/reservations/history`);
    return response.data.data;
  }
};
