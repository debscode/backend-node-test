import { Router } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser, login } from '../controllers/user.controller';
import { checkToken } from "../middlewares/authentication";

const router = Router();

router.get('/users', checkToken, getUsers);
router.get('/users/:id', checkToken, getUser);
router.post('/users', checkToken, createUser);
router.put('/users/:id', checkToken, updateUser);
router.delete('/users/:id', checkToken, deleteUser);

router.post('/login', login);

export default router;