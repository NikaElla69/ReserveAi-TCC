import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { asyncHandler } from '../middlewares/async.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, refreshTokenSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate({ body: registerSchema }), asyncHandler(authController.register.bind(authController)));
router.post('/login', validate({ body: loginSchema }), asyncHandler(authController.login.bind(authController)));
router.get('/me', authMiddleware, asyncHandler(authController.me.bind(authController)));
router.post('/refresh', validate({ body: refreshTokenSchema }), asyncHandler(authController.refresh.bind(authController)));
router.post('/logout', validate({ body: refreshTokenSchema }), asyncHandler(authController.logout.bind(authController)));

export default router;
