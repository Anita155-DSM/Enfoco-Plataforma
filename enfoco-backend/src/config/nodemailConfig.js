import 'dotenv/config';

const sendVerificationEmail = async (toEmail, verificationToken) => {
    const verificationUrl = `http://localhost:3000/api/auth/confirm-email?token=${verificationToken}`;

    console.log(`\n--- SIMULANDO ENVÍO DE CORREO DE VERIFICACIÓN ---`);
    console.log(`Para: ${toEmail}`);
    console.log(`Asunto: Confirma tu cuenta de EnFoco`);
    console.log(`Enlace de verificación: ${verificationUrl}`);
    console.log(`--------------------------------------------------\n`);

    return true;
};

export { sendVerificationEmail };