/**
 * Admin Service
 * Serviço para operações administrativas
 */

import { api } from './api';

export const adminService = {
  /**
   * Obter dashboard com estatísticas
   */
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  /**
   * Listar usuários
   */
  async listUsers(filters?: any) {
    const response = await api.get('/admin/users', { params: filters });
    return response.data.data;
  },

  /**
   * Listar reservas
   */
  async listReservations(filters?: any) {
    const response = await api.get('/admin/reservations', { params: filters });
    return response.data.data;
  },

  /**
   * Listar restaurantes
   */
  async listRestaurants(filters?: any) {
    const response = await api.get('/admin/restaurants', { params: filters });
    return response.data.data;
  },

  /**
   * Listar tenants
   */
  async listTenants(filters?: any) {
    const response = await api.get('/admin/tenants', { params: filters });
    return response.data.data;
  },

  /**
   * Alternar status do usuário
   */
  async toggleUserStatus(userId: number) {
    const response = await api.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  /**
   * Deletar usuário
   */
  async deleteUser(userId: number) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Obter logs de auditoria
   */
  async getAuditLogs(filters?: any) {
    const response = await api.get('/admin/audit-logs', { params: filters });
    return response.data.data;
  },

  /**
   * Obter estatísticas de uso
   */
  async getUsageStats(period?: string) {
    const response = await api.get('/admin/usage-stats', { params: { period } });
    return response.data;
  }
};
