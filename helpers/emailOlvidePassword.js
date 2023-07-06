import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { nombre, email, token } = datos;

    // Enviar el Email

    const info =await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reestablece tu Contraseña',
        text: 'Reestablece tu Contraseña',
        html: `<p>Hola ${nombre}, Has solicitado reestablecer tu contraseña</p>
                <p>Sigue el siguiente enlace para generar una nueva contraseña:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Contraseña</a>
                </p>

                <p>Si tu no hiciste esta solicitud, puedes ignorar este mensaje</p>
        `
    })

    console.log('Mensaje enviado: %s', info.messageId);
}


export default emailOlvidePassword;