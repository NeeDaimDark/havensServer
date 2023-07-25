import User, { loginValidate, userValidate } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import { Error, model } from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from 'ejs';
import sendConfirmationEmail from "../middlewares/mailer.js";
import crypto from 'crypto';
import moment from 'moment';
import schedule from 'node-schedule';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getAll(req, res) {
    try {
        const users = await User
            .find({}).lean();
        console.log(users);
        res.status(200).json({users});
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function getAllusr(req, res) {
    res.send({users: await User.find()})
}
export async function profile(req, res) {
    try {
        const { _id } = req.user;
        const connectedUser = await User.findById(_id).lean();
        res.status(200).json(connectedUser);
    } catch (err) {
        res.status(401).json({ "message": "authentication problem" })
    }

}


// register
export async function register(req, res) {
    const { error } = userValidate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user;
    try {
        user = await User.findOne({ email: req.body.email });
    } catch (err) {
        return res.status(500).send('An error occurred while searching for the user.');
    }

    if (user) {
        return res.status(404).send('Email already exists');
    }


    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const { UserId,username, email,publickey } = req.body
    await User
        .create({
            UserId,
            username,
            email,
            password: hashedPassword,
            role: "user",
            otpCode: "$2b$10$mhjRG0mlSuN3KaFu5UcndumyAfO0AAwDR",
            publickey,
            score: 0,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0, w: 0 }
            
    
           
        })
        .then(docs => {
            res.status(200).json({ message: 'User Added Successfully!', docs });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    await sendRegistrationMail(email);
}
export async function sendMail(req, res) {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "oussama.said@esprit.tn",
                pass: "nafti92769118"
            },
        });
        let info = transporter.sendMail({
            from: "oussama.said@esprit.tn",
            to: "oussamasaid929@gmail.com",
            subject: "Message",
            text: "I hope this message gets through!",
        });
        res.json(info);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }


}

export async function sendRegistrationMail(email) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "oussama.said@esprit.tn",
            pass: "nafti92769118"
        },
    });
    transporter.sendMail({
        from: "oussama.said@esprit.tn",
        to: email,
        subject: "welcome",
        text: "welcome to our game haven",
    });
}


//login

export async function login(req, res) {
    const { error } = loginValidate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send('Invalid email or password');
    }

    const checkPassword = await bcrypt.compare(req.body.password, user.password);
    if (!checkPassword) {
        return res.status(404).send('Invalid email or password');
    }

    // Générer un code unique et sécurisé composé de 8 caractères
    const confirmCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    // Crypter le code avec bcrypt
    // const salt = await bcrypt.genSalt(10);
    // const hashedCode = await bcrypt.hash(confirmCode, salt);

    // Définir l'heure d'expiration du code
    const expiration = moment().add(5, 'minutes');

    //user.code = hashedCode;
    user.code = confirmCode;
    user.codeExpiration = expiration;
    await user.save();

    // Envoyer l'e-mail avec le code
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'oussama.said@esprit.tn',
            pass: 'nafti92769118'
        }
    });

    const mailOptions = {
        from: 'oussama.said@esprit.tn',
        to: user.email,
        subject: 'Code to link your account to our game Haven',
        text: `Your code is ${confirmCode}. This code will expire at ${expiration.format('MMMM Do YYYY, h:mm:ss a')}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('E-mail envoyé : ' + info.response);
        }
    });

    // Planifier la suppression de l'attribut "code" de l'objet "user" après cinq minutes
    schedule.scheduleJob(expiration.toDate(), async function() {
        user.code = null;
        user.codeExpiration = null;
        await user.save();
    });

    // Retourner la réponse avec le token et l'utilisateur
    const token = jwt.sign({ _id: user._id }, 'privateKey');
    res.header('x-auth-token', token).status(200).send({ token: token, user: user });
}

//Recherche d’un seul document
export async function getOnce(req, res) {

    await User
        .findById(req.params.id)
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

export async function patchOnce(req, res) {

    await User
        //findByIdAndUpdate si vous voulez modifier un document à l’aide de son ID.
        .findByIdAndUpdate(req.params.id, req.body)
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });

}

export async function deleteOnce(req, res) {
    try {
        let checkIfUserExists = await User.findById(req.params.id);
        if (!checkIfUserExists) throw new Error();
        const user = await User
            .findByIdAndRemove(req.params.id)
        res.status(200).json({ "message": user });
    } catch (err) {
        res.status(404).json({ message: "user not found" });
    }

}

//forgot password





export  async function forgetPassword (req, res, next) {

    const { email } = req.body;

    const renderedUser = await User.findOne({ email });

    if (!renderedUser) {

        throw new Error("user not found");
    }
    // sendRegistrationMail(email)
    sendMail()
    res.status(200).json({ code: renderedUser.otpCode });

    /**
     *
     * let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "oussama.said@esprit.tn",
                pass: ""
            },
        });

     transporter.sendMail({
            from: "oussama.said@esprit.tn",
            to: email,
            subject: "forget password",
            text: `here your reset password code ${renderedUser.otpCode}`,
        });
     *
     *
     *  */



};

export const changePassword = async (req, res, next) => {
    try {
        const { code, newPassword, email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("wrong email");
        }
        const isValidCode = await bcrypt.compare(code.toString(), user.otpCode);
        if (!isValidCode) {
            throw new Error("wrong code");
        }

        const newCode = Math.floor(1000 + Math.random() * 9000);
        const encryptedCode = await bcrypt.hash(newCode.toString(), 10);

        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id || user.id },
            {
                $set: {
                    password: await bcrypt.hash(newPassword, 10),
                    otpCode: encryptedCode,
                },
            },
            { returnOriginal: false }
        );
        res.status(200).json({ user: updatedUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};


export const changePasswordInProfile = async (req, res, next) => {
    try {
        const {id} = req.params;
        const { password, newPassword } = req.body;
        const renderedUser = await User.findOne({ _id: id });
        if (!renderedUser) {
            throw new Error("wrong email");
        }
        const checkIfPasswordIsOkay = await bcrypt.compare(password, renderedUser.password);
        if (!checkIfPasswordIsOkay) {
            throw new Error("wrong password");
        }

        const updatedUser = await User.findOneAndUpdate({ _id: renderedUser._id || renderedUser.id }, {
                $set: {
                    password: await bcrypt.hash(newPassword, 10),
                }
            }
            , { returnOriginal: false });
        res.status(200).json({ user: updatedUser });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
}


//  reset Password email

// export async function resetPass(req, res) {
//     try {
//       const user = await User.findOne({ email: req.body.email });

//       if (!user) {
//         return res.status(404).send({ message: "User not found" });
//       }

//       const newCode = Math.floor(1000 + Math.random() * 9000);
//       const encryptedCode = await bcrypt.hash(newCode.toString(), 10);

//       user.otpCode = encryptedCode;

//       await user.save();
//       await sendConfirmationEmail(req.body.email, newCode);

//       res.status(200).send({ newCode });
//     } catch (err) {
//       console.log("Error: ", err);
//       res.status(500).send({ message: err.message });
//     }
//   }
//
export async function resetPass(req, res) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        const newCode = Math.floor(1000 + Math.random() * 9000);
        const encryptedCode = await bcrypt.hash(newCode.toString(), 10);

        user.otpCode = encryptedCode;
        sendConfirmationEmail(req.body.email, newCode);

        await user.save();
        res.status(200).send({ newCode });
    } catch (err) {
        console.log("error", err);
        res.status(500).send({ message: err.message });
    }
}
export async function searchPublicKeyByCode(req, res) {
    const { code } = req.body;

    try {
        const user = await User.findOne({ code: code });

        if (!user) {
            return res.status(404).json({ message: 'Verification code not found' });
        }

        // Return the public key if the verification code is found
        res.status(200).json({ publicKey: user.publickey });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while searching for the public key' });
    }
}
export async function updateUserbyuserId(req, res) {
    const { publickey } = req.params;
    const { username, email, password, score,code, questsDone,position,rotation} = req.body;
  
    try {
      const user = await User.findOneAndUpdate(
        { publickey: publickey }, // Find the user by UserId
        {$set:{score,questsDone,code,username,position,rotation }}, // Update the user's information
        { new: true } // Return the updated user
      );
  
      if (!user) {
        throw new Error(`User with public key  ${publickey} not found`);
      }
  
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  }
  
  export async function getUserbyUserId(req, res) {
    try {
        const {publickey} = req.params;
        const user = await User.findOne({publickey}).populate('username').populate('publickey').populate('score').populate('position').populate('rotation');
    
        if (!user) {
          return res.status(404).json({message: `User with id ${publickey} not found`});
        }
    
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({message: error.message});
      }
    // try {
    //   // Retrieve the userId from the request parameters or body
    //   const userId = req.params.userId || req.body.userId;
  
    //   // Query the user from the database
    //   const user = await User.findOne({ UserId: userId });
  
    //   if (!user) {
    //     return res.status(404).json({ error: 'User not found' });
    //   }
  
    //   // Return the user data
    //   res.json(user);
    // } catch (error) {
    //   console.error('Error retrieving user:', error);
    //   res.status(500).json({ error: 'Server error' });
    // }
  }
  export async function checkCode(req, res) {
    try {
        const { code } = req.body;
      const user = await User.findOne({ code: code }).exec();
  
      if (!user) {
        return res.status(201).json({ error: "Code not found" });
      }
      res.status(200).json({ code: user.code });
      const codeValid = await bcrypt.compare(req.body.code, user.code);
  
      if (!codeValid) {
       //return res.status(500).json({ error: "Invalid code" });
      }
  
      const now = moment();
      const codeExpired = now.isAfter(user.codeExpiration);
  
      if (codeExpired) {
        return res.status(201).json({ error: "Code has expired" });
      }
  
     // return res.status(201).json({ message: "Code exists and is valid" });
    } catch (err) {
      console.error(err);
     // return res.status(201).json({ error: "An error occurred" });
    }
  }
  export async function getPlayerPos(req, res) {
    const publicKey = req.params.publicKey;

    try {
        const user = await User.findOne({ publickey: publicKey }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const position = user.position;
        const rotation = user.rotation;
        res.status(200).json({ position, rotation });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while retrieving player position' });
    }
}


//   export async function updateUserScorebyUserId(publickey, score) {
//     try {
//       const user = await User.findOne({ publickey: publickey });
//       if (!user) {
//         throw new Error("User not found");
//       }
//       user.score = score;
//       await user.save();
//       return user;
//     } catch (error) {
//       console.error("Error updating user score:", error);
//       throw error;
//     }
//   }
  
  // Export additional controller functions as needed
  
  
  
  
  
  
  
  

