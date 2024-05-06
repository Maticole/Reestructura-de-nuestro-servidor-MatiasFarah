const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};


const sendPasswordResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    
  });

  const mailOptions = {
    from: 'your@example.com',
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${process.env.CLIENT_URL}/reset-password/${token}`,
  };

  await transporter.sendMail(mailOptions);
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const token = generateToken({ email });
    await sendPasswordResetEmail(email, token);

    return res.status(200).json({ message: 'Correo de restablecimiento enviado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  requestPasswordReset,
};