
import mongoose from 'mongoose';
import express from "express";
import PlayerPositions from "../models/PlayerPosition.js";
const router = express.Router();

// use PlayerPositions in your routes and logic



import db from '../config/db.js';

router.post("/store-position", (req, res) => {
    const playerId = req.body.playerId;
    const position = req.body.position;


    const playerPosition = new PlayerPosition({
        playerId: playerId,
        position: position
    });
    playerPosition.save((err, doc) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error storing player position");
        } else {
            res.send("Player position stored successfully");
        }
    });
});


router.put('/updatePosition', function(req, res) {
    console.log('Received position update:', req.body);
    const collection = db.collection('positions');
    const query = { _id: 1 };
    const update = { $set: { position: req.body.position, rotation: req.body.rotation } };
    const options = { upsert: true };
    collection.updateOne(query, update, options, function(err, result) {
        if (err) {
            console.log('Error updating position in MongoDB:', err);
            res.status(500).send('Error updating position');
        } else {
            console.log('Position updated in MongoDB');
            res.status(200).send('Position updated');
        }
    });
});
router.get("/retrievePosition", (req, res) => {
    const collection = db.collection('positions');
    const query = { _id: 1 };
    collection.findOne(query, (err, doc) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving player position");
        } else if (!doc) {
            res.status(404).send("Player position not found");
        } else {
            res.json({ position: doc.position, rotation: doc.rotation });
        }
    });
});



router.get('/r', async (req,res)=>
{
    PlayerPosition.findOne({ _id: 1 }, (err, doc) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error retrieving player position");
        } else if (!doc) {
            res.status(404).send("Player position not found");
        } else {
            res.json({ position: doc.position, rotation: doc.rotation });
        }
    });
});



export default router;