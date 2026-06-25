import { Router } from 'express';
import { tableController } from '../controllers/table.controller';
import { asyncHandler } from '../middlewares/async.middleware';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.get('/restaurant/:restaurantId', asyncHandler(tableController.listByRestaurant.bind(tableController)));
router.get('/:id', asyncHandler(tableController.getById.bind(tableController)));
router.post('/', authMiddleware, authorizeRoles('OWNER', 'ADMIN'), asyncHandler(tableController.create.bind(tableController)));
router.put('/:id', authMiddleware, authorizeRoles('OWNER', 'ADMIN'), asyncHandler(tableController.update.bind(tableController)));
router.delete('/:id', authMiddleware, authorizeRoles('OWNER', 'ADMIN'), asyncHandler(tableController.delete.bind(tableController)));

export default router;
