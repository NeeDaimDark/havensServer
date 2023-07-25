import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const gameSchema = new mongoose.Schema({
  gameId:{
    type: String,
    default: uuidv4,
    unique: true
  },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  winner: [
      {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',

  }
  ]

});

const Game = mongoose.model('Game', gameSchema);

export  default Game;
