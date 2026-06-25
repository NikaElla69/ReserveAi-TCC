import { Router } from 'express';
import { reservationController } from '../controllers/reservation.controller';
import { asyncHandler } from '../middlewares/async.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(reservationController.list.bind(reservationController)));
router.get('/:id', asyncHandler(reservationController.getById.bind(reservationController)));
router.post('/', asyncHandler(reservationController.create.bind(reservationController)));
router.put('/:id', asyncHandler(reservationController.update.bind(reservationController)));
router.patch('/:id/status', asyncHandler(reservationController.updateStatus.bind(reservationController)));
router.delete('/:id', asyncHandler(reservationController.delete.bind(reservationController)));

export default router;
