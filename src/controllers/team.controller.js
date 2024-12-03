import Team from '../models/Team.model.js';

export const filterTeams = async (req, res) => {
  try {
    const { searchTerm, sport, category } = req.query;
    let query = {};

    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    if (sport) {
      query.sport = sport;
    }

    if (category) {
      query.category = category;
    }

    const teams = await Team.find(query)
      .populate('owner players', '-password');

    res.json(teams);
  } catch (error) {
    console.error('Error filtering teams:', error);
    res.status(500).json({ message: error.message });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { name, sport, category, location, description } = req.body;

    if (!name || !sport || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const team = await Team.create({
      name,
      sport,
      category,
      location,
      description,
      owner: req.user._id,
      players: [req.user._id]
    });

    await team.populate('owner players', '-password');
    res.status(201).json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('owner players', '-password');
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: error.message });
  }
};

export const joinTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.players.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member of this team' });
    }

    team.players.push(req.user._id);
    await team.save();
    await team.populate('owner players', '-password');
    
    res.json(team);
  } catch (error) {
    console.error('Error joining team:', error);
    res.status(500).json({ message: error.message });
  }
};