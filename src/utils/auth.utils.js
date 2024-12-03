import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const validateRegistrationData = (data) => {
  const { email, password, name, role, latitude, longitude } = data;
  
  if (!email || !password || !name || !role || !latitude || !longitude) {
    return {
      isValid: false,
      message: 'Por favor proporcione todos los campos requeridos: email, contraseña, nombre, rol, latitud, longitud'
    };
  }

  if (!email.includes('@')) {
    return {
      isValid: false,
      message: 'Por favor proporcione un email válido'
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: 'La contraseña debe tener al menos 6 caracteres'
    };
  }

  if (!['entrenador', 'jugador'].includes(role)) {
    return {
      isValid: false,
      message: 'El rol debe ser "entrenador" o "jugador"'
    };
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    return {
      isValid: false,
      message: 'Latitud y longitud deben ser números válidos'
    };
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return {
      isValid: false,
      message: 'Coordenadas geográficas inválidas'
    };
  }

  return { isValid: true };
};