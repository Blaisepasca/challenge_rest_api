import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

router.post('/', userController.createUser.bind(userController));

router.get('/:id', userController.getUserById.bind(userController));

router.get('/', userController.getAllUsers.bind(userController));

export default router;