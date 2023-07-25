import { default as Game } from "../models/game.js"; // add validate
import { default as Player } from '../models/player.js';
import { validationResult } from "express-validator";
import mongoose from 'mongoose';
export function getAll(req, res) {
  Game.find({})
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function getById(req, res) {
  Game.findById(req.params.id)
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
export async function getGameByGameId(req, res) {
  try {
    const {gameId} = req.params;
    const game = await Game.findOne({gameId}).populate('players').populate('winner');

    if (!game) {
      return res.status(404).json({message: `Game with id ${gameId} not found`});
    }

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}
export async function updateGameById(req, res, next){
  try {
    const gameId = req.params.gameId;
    const { winnerId } = req.body;
    const winner = mongoose.Types.ObjectId(winnerId);
    const game = await Game.findOneAndUpdate({ gameId }, { $push: { winner } }, { new: true });
    if (!game) {
      throw new Error(`Game with gameId ${gameId} not found`);
    }
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
};
export async function addOnce(req, res, next) {
  try {
    const { gameId } = req.body;
    const { players } = req.body;
    const { winner } =req.body;
    const game = new Game({ gameId, players }); // set gameId before saving
    await game.save();
    res.status(201).json(game); // return saved game object
  } catch (error) {
    next(error);
  }
}

export async function updateOnce(req, res, next) {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    game.players = req.body.players;
    game.winner = req.body.winner;

    await game.save();
    res.json(game);
  } catch (error) {
    next(error);
  }
}

export async function deleteOnce(req, res) {
  Game.findOneAndRemove(req.id, req.body)
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};


export async function deleteGameById(req, res, next) {
  try {
    const gameId = req.params.gameId;
    const game = await Game.findOneAndDelete({ gameId });
    if (!game) {
      throw new Error(`Game with gameId ${gameId} not found`);
    }
    res.status(200).json({ message: `Game with gameId ${gameId} deleted successfully` });
  } catch (error) {
    next(error);
  }
};

