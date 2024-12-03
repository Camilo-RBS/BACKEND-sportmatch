import Match from '../models/Match.model.js';

export const createMatch = async (req, res) => {
  try {
    const { date, competition, homeTeam, awayTeam, location } = req.body;

    if (homeTeam === awayTeam) {
      return res.status(400).json({ 
        message: 'El equipo local y visitante no pueden ser el mismo' 
      });
    }

    const match = await Match.create({
      date: new Date(date),
      competition,
      homeTeam,
      awayTeam,
      location,
      coachId: req.user._id
    });

    await match.populate([
      { path: 'homeTeam' },
      { path: 'awayTeam' },
      { path: 'coachId', select: '-password' }
    ]);

    res.status(201).json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ 
      message: error.message || 'Error al crear el partido' 
    });
  }
};

export const getMatches = async (req, res) => {
  try {
    const { date, competition } = req.query;
    const query = { winner: null }; // Solo partidos sin resultado

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (competition) {
      query.competition = competition;
    }

    const matches = await Match.find(query)
      .populate('homeTeam')
      .populate('awayTeam')
      .populate('coachId', '-password')
      .sort({ date: 1 });

    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ 
      message: error.message || 'Error al obtener los partidos' 
    });
  }
};

export const getMatchHistory = async (req, res) => {
  try {
    const { date, competition } = req.query;
    const query = {}; // Todos los partidos

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (competition) {
      query.competition = competition;
    }

    const matches = await Match.find(query)
      .populate('homeTeam')
      .populate('awayTeam')
      .populate('coachId', '-password')
      .sort({ date: -1 });

    res.json(matches);
  } catch (error) {
    console.error('Error fetching match history:', error);
    res.status(500).json({ 
      message: error.message || 'Error al obtener el historial' 
    });
  }
};

export const updateMatch = async (req, res) => {
  try {
    const { score, winner, homeScorers, awayScorers } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }

    if (match.coachId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        message: 'No autorizado para actualizar este partido' 
      });
    }

    match.score = score;
    match.winner = winner;
    match.homeScorers = homeScorers.filter(scorer => scorer.trim());
    match.awayScorers = awayScorers.filter(scorer => scorer.trim());

    await match.save();
    await match.populate([
      { path: 'homeTeam' },
      { path: 'awayTeam' },
      { path: 'coachId', select: '-password' }
    ]);
    
    res.json(match);
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ 
      message: error.message || 'Error al actualizar el partido' 
    });
  }
};