import User from '../models/User.js';
import crypto from 'crypto';
import { sendVerificationEmail } from '../config/nodemailConfig.js';

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'Ya existe una cuenta con este email.' });
        }

        user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = await User.create({
            username,
            email,
            password,
            verificationToken,
            isVerified: false,
        });

        await sendVerificationEmail(newUser.email, verificationToken);

        res.status(201).json({
            message: 'Registro exitoso. Por favor, verifica tu correo electrónico para activar tu cuenta.',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                isVerified: newUser.isVerified
            }
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
    }
};

const confirmEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user) {
            return res.status(400).send('Token de verificación no válido o expirado.');
        }

        if (user.isVerified) {
            return res.status(200).send('Tu cuenta ya ha sido verificada.');
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).send('¡Cuenta verificada exitosamente! Ahora puedes iniciar sesión.');

    } catch (error) {
        console.error('Error al confirmar correo:', error);
        res.status(500).send('Error interno del servidor al confirmar correo.');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // ¡ADVERTENCIA! Comparación de contraseña en texto plano (INSEGURO)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Tu cuenta no ha sido verificada. Por favor, revisa tu correo electrónico.' });
        }

        res.status(200).json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
    }
};

export {
    registerUser,
    confirmEmail,
    loginUser,
};