import { api } from './api';

export const reviewService = {
  /**
   * Criar nova avaliacao
   */
  async create(restaurantId: number, data: any) {
    const response = await api.post('/reviews', {
      restaurant_id: restaurantId,
      ...data
    });
    return response.data;
  },

  /**
   * Listar avaliacoes de um restaurante
   */
  async listByRestaurant(restaurantId: number, filters?: any) {
    const response = await api.get(`/restaurants/${restaurantId}/reviews`, {
      params: filters
    });
    return response.data.data;
  },

  /**
   * Obter estatisticas de avaliacoes
   */
  async getStatistics(restaurantId: number) {
    const response = await api.get(`/restaurants/${restaurantId}/reviews/statistics`);
    return response.data.data;
  },

  /**
   * Obter avaliacao por ID
   */
  async getById(reviewId: number) {
    const response = await api.get(`/reviews/${reviewId}`);
    return response.data.data;
  },

  /**
   * Atualizar avaliacao
   */
  async update(reviewId: number, data: any) {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  },

  /**
   * Deletar avaliacao
   */
  async delete(reviewId: number) {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  /**
   * Marcar como util
   */
  async markHelpful(reviewId: number) {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },

  /**
   * Marcar como nao util
   */
  async markUnhelpful(reviewId: number) {
    const response = await api.post(`/reviews/${reviewId}/unhelpful`);
    return response.data;
  },

  /**
   * Listar avaliacoes do usuario
   */
  async listByUser() {
    const response = await api.get('/users/reviews');
    return response.data.data;
  }
};
