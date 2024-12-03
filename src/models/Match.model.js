import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  competition: {
    type: String,
    required: true,
    enum: ['liga', 'copa', 'champions']
  },
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  score: {
    type: String,
    default: null
  },
  winner: {
    type: String,
    default: null
  },
  homeScorers: [{
    type: String
  }],
  awayScorers: [{
    type: String
  }],
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las consultas
matchSchema.index({ date: 1 });
matchSchema.index({ competition: 1 });
matchSchema.index({ coachId: 1 });
matchSchema.index({ winner: 1 });

const Match = mongoose.model('Match', matchSchema);
export default Match;