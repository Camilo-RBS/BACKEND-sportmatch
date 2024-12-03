import Message from '../models/Message.model.js';

export const sendMessage = async (req, res) => {
  try {
    const { content, receiver, isGlobal } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'El contenido del mensaje es requerido' });
    }

    const messageData = {
      sender: req.user._id,
      content,
      isGlobal
    };

    if (!isGlobal && receiver) {
      messageData.receiver = receiver;
    }

    const newMessage = await Message.create(messageData);
    await newMessage.populate('sender', '-password');
    if (!isGlobal && receiver) {
      await newMessage.populate('receiver', '-password');
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ 
      message: 'Error al enviar mensaje',
      error: error.message 
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let query;
    if (userId) {
      // Mensajes privados entre dos usuarios
      query = {
        isGlobal: false,
        isDeleted: false,
        $or: [
          { sender: req.user._id, receiver: userId },
          { sender: userId, receiver: req.user._id }
        ]
      };
    } else {
      // Mensajes globales
      query = { 
        isGlobal: true,
        isDeleted: false,
        createdAt: { 
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
        }
      };
    }

    const messages = await Message.find(query)
      .populate('sender', '-password')
      .populate('receiver', '-password')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ 
      message: 'Error al obtener mensajes',
      error: error.message 
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado para eliminar este mensaje' });
    }

    message.isDeleted = true;
    await message.save();

    res.json({ message: 'Mensaje eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    res.status(500).json({ 
      message: 'Error al eliminar mensaje',
      error: error.message 
    });
  }
};