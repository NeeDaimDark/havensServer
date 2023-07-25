import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import gameRoutes from "./routes/gameRoutes.js";
import playerRoutes from './routes/playerRoutes.js'; // Import the player routes
import { NotFoundError, errorHandler } from "./middlewares/error-handler.js";
import morgan from "morgan";
import connectDb from "./config/db.js";
import bodyParser from "body-parser";
import BlockchainRouter from "./routes/Blockchain.js";
import PlayerPosRouter from "./routes/PlayerPos.js";
import userRoutes from './routes/user.js';
import path from 'path';
import multer from 'multer';



const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
dotenv.config();

const hostname = process.env.DOCKERSERVERURL;
const port = process.env.SERVERPORT;

//info on req : GET /route ms -25
app.use(morgan("tiny"));

app.use(cors());
connectDb();
//bech taati acces lel dossier media li fih les images, localhost:9095/media/fifa.jpg
app.use("/media", express.static("media"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use('/user/upload', express.static('upload/images'));
app.use('/img', express.static('upload/images'));
const storage = multer.diskStorage({
  destination: (req,file, cb) => {
    cb( null , './upload/images')
  },
  filename:  (req, file ,cb) => {
        
       // cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
        cb(null,`${file.originalname}`);

  }
})

const upload = multer({storage: storage})
app.post("/uploads", upload.single('upload'), (req,res) => {
  res.json({
     success: 1,
     profilPic:`${req.file.filename}`
  })
})
//app.use(bodyParser.json());
app.use("/game", gameRoutes);
app.use('/user',userRoutes);
//app.use('/players', playerRoutes); // Use the player routes
//app.use(itemController);
//app.use(AuthentificationRouter);
app.use(PlayerPosRouter);
app.use(BlockchainRouter);
app.use(NotFoundError);
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running on ${hostname}:${port}`);
});
