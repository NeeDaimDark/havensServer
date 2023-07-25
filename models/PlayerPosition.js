import mongoose from 'mongoose';

const { Schema } = mongoose;

const positionSchema = new Schema({
    _id: Number,
    playerId: String,
    position: {
        x: Number,
        y: Number,
        z: Number,
    },
    rotation: {
        x: Number,
        y: Number,
        z: Number,
        w: Number,
    },
});
const PlayerPositions = mongoose.model("PlayerPositions", positionSchema);

export default PlayerPositions;
