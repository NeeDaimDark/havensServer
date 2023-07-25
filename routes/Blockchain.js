import mongoose from 'mongoose';
import express from "express";

import pkg2 from "../Recompense.cjs";
import  pkg  from "../Rec.cjs";
const router = express.Router();
const check = pkg;
const sendTokens = pkg2;
// use PlayerPositions in your routes and logic
router.post('/send', async (req,res)=>
{
    await sendTokens(req.body.id,req.body.amount)
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});
router.post('/check', async (req,res)=>
{
    await check(req.body.name,req.body.adresse)
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});


export default router;