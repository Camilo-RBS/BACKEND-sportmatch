import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isGlobal: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las consultas
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ isGlobal: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;