import { Router } from 'express';
import { restaurantController } from '../controllers/restaurant.controller';
import { asyncHandler } from '../middlewares/async.middleware';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', asyncHandler(restaurantController.list.bind(restaurantController)));
router.get('/owner/me', authMiddleware, authorizeRoles('OWNER', 'ADMIN'), asyncHandler(restaurantController.listByOwner.bind(restaurantController)));
router.get('/slug/:slug', asyncHandler(restaurantController.getBySlug.bind(restaurantController)));
router.get('/:id', asyncHandler(restaurantController.getById.bind(restaurantController)));
router.get('/:id/availability', asyncHandler(restaurantController.availability.bind(restaurantController)));
router.post('/', authMiddleware, authorizeRoles('OWNER', 'ADMIN'), asyncHandler(restaurantController.create.bind(restaurantController)));
router.put('/:id', authMiddleware, authorizeRoles('OWNER', 'ADMIN'), asyncHandler(restaurantController.update.bind(restaurantController)));
router.delete('/:id', authMiddleware, authorizeRoles('OWNER', 'ADMIN'), asyncHandler(restaurantController.delete.bind(restaurantController)));

export default router;
