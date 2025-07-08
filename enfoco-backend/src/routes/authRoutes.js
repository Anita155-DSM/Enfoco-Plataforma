import express from 'express';
import { registerUser, loginUser} from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;

// Este archivo define las rutas (endpoints) de la API para la Autenticación de usuarios.
// Importa Express para crear el router y funciones del controlador (authController.mjs)
// para manejar la lógica de registro, confirmación de email y login de usuarios.
