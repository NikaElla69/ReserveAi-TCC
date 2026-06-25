/**
 * Restaurant Image Service
 * Gerencia requisições de imagens de restaurante
 */

import { api } from './api';

export interface RestaurantImage {
  id: number;
  restaurant_id: number;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface UploadImageInput {
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
}

export interface UpdateImageInput {
  altText?: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

class RestaurantImageService {
  /**
   * Listar imagens de um restaurante
   */
  async listByRestaurant(restaurantId: number): Promise<RestaurantImage[]> {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/images`);
      return response.data.data.images || [];
    } catch (error) {
      console.error('Error fetching restaurant images:', error);
      throw error;
    }
  }

  /**
   * Obter imagem primária de um restaurante
   */
  async getPrimary(restaurantId: number): Promise<RestaurantImage | null> {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/images/primary`);
      return response.data.data.image || null;
    } catch (error) {
      console.error('Error fetching primary image:', error);
      return null;
    }
  }

  /**
   * Upload de imagem para restaurante
   */
  async upload(restaurantId: number, input: UploadImageInput): Promise<RestaurantImage> {
    try {
      const response = await api.post(`/restaurants/${restaurantId}/images`, input);
      return response.data.data.image;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Atualizar imagem
   */
  async update(imageId: number, input: UpdateImageInput): Promise<RestaurantImage> {
    try {
      const response = await api.put(`/images/${imageId}`, input);
      return response.data.data.image;
    } catch (error) {
      console.error('Error updating image:', error);
      throw error;
    }
  }

  /**
   * Deletar imagem
   */
  async delete(imageId: number): Promise<void> {
    try {
      await api.delete(`/images/${imageId}`);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Reordenar imagens
   */
  async reorder(restaurantId: number, imageIds: number[]): Promise<void> {
    try {
      await api.post(`/restaurants/${restaurantId}/images/reorder`, { imageIds });
    } catch (error) {
      console.error('Error reordering images:', error);
      throw error;
    }
  }

  /**
   * Definir imagem como primária
   */
  async setPrimary(imageId: number): Promise<RestaurantImage> {
    try {
      const response = await api.put(`/images/${imageId}`, { isPrimary: true });
      return response.data.data.image;
    } catch (error) {
      console.error('Error setting primary image:', error);
      throw error;
    }
  }
}

export const restaurantImageService = new RestaurantImageService();
