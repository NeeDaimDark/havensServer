import { validationResult } from "express-validator";
import {default as Player} from "../models/player.js";

export function getAll(req, res) {
    Player.find({})
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function getById(req, res) {
    Player.findById(req.params.id)
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export async function addOnce(req, res, next) {
    try {
        const { username } = req.body;
        const { score } = req.body;
        const player = new Player({ username , score });
        await player.save();
        res.status(201).json(Player);
    } catch (error) {
        next(error);
    }
}

export async function updateOnce (req, res, next)
{
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        player.username = req.body.username;
        player.score = req.body.score;

        await player.save();
        res.json(player);
    } catch (error) {
        next(error);
    }
}


export function deleteOnce(req, res) {
    Player.findOneAndRemove(req.id, req.body)
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}
