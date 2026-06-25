import prisma from '../lib/prisma';

export interface UpsertRestaurantSettingsInput {
  restaurantId: string;
  primaryColor: string;
  secondaryColor: string;
  bannerImage?: string | null;
  customSlug: string;
  instagram?: string | null;
  facebook?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  descricaoCurta?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: string | null;
}

export interface CreateRestaurantImageInput {
  restaurantId: string;
  imageUrl: string;
  title?: string | null;
  displayOrder?: number;
  altText?: string | null;
}

export class RestaurantBrandingRepository {
  async getSettingsByRestaurantId(restaurantId: string) {
    return prisma.restaurantSetting.findUnique({
      where: { restaurantId },
    });
  }

  async upsertSettings(data: UpsertRestaurantSettingsInput) {
    return prisma.restaurantSetting.upsert({
      where: { restaurantId: data.restaurantId },
      create: data,
      update: data,
    });
  }

  async listImages(restaurantId: string) {
    return prisma.restaurantImage.findMany({
      where: { restaurantId },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async createImage(data: CreateRestaurantImageInput) {
    return prisma.restaurantImage.create({
      data: {
        ...data,
        displayOrder: data.displayOrder ?? 0,
      },
    });
  }

  async deleteImage(id: string) {
    return prisma.restaurantImage.delete({
      where: { id },
    });
  }

  async reorderImages(restaurantId: string, imageIds: string[]) {
    return prisma.$transaction(
      imageIds.map((imageId, index) =>
        prisma.restaurantImage.update({
          where: { id: imageId, restaurantId },
          data: { displayOrder: index + 1 },
        })
      )
    );
  }
}

export const restaurantBrandingRepository = new RestaurantBrandingRepository();
