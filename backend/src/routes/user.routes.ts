import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { asyncHandler } from '../middlewares/async.middleware';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', authorizeRoles('ADMIN'), asyncHandler(userController.list.bind(userController)));
router.post('/', authorizeRoles('ADMIN'), asyncHandler(userController.create.bind(userController)));
router.get('/:id', asyncHandler(userController.getById.bind(userController)));
router.put('/:id', asyncHandler(userController.update.bind(userController)));
router.delete('/:id', asyncHandler(userController.delete.bind(userController)));
router.get('/:id/reservations/history', asyncHandler(userController.reservationHistory.bind(userController)));

export default router;
