import express from 'express';

import { register, deleteOnce, getAll, getOnce, patchOnce, login, profile, sendMail, sendRegistrationMail, forgetPassword, getPlayerPos, changePassword, changePasswordInProfile, resetPass, getAllusr,searchPublicKeyByCode,getUserbyUserId,updateUserbyuserId,checkCode} from '../controllers/user.js';
//import sendRegistrationMail from '../controllers/user.js'
import { checkToken } from '../middlewares/auth.js';

const router = express.Router();

// create account
router
    .route('/register')
    .post(register);
// router
// .route('/code')
// .post(code);

// router
// .route('/wallet')
// .post(connectToWallet);

// login
router
    .route('/getOnce/:id')
    .get(getOnce)
router
    .route('/login')
    .post(login);




/*router
.post("/forgetPassword", forgetPassword);
*/
router
    .route('/reset' ).post(resetPass);


router.post("/changePassword", changePassword);

router.post("/changePasswordProfile/:id", changePasswordInProfile);

router
    .route('/mail')
    .post(sendMail);


router
    .route('/')
    .get(getAll);

router.route('/usrs').get(getAllusr);

/**
 * router
 .route('/')
 .get(checkToken, getAll)
 .post(register);





 router
 .route('/register')
 .post(sendRegistrationMail);
 */
router
    .route('/:id')
    .patch(checkToken, patchOnce)
    .delete( deleteOnce);
//router.get("/profile", checkToken, profile)
router.post("/login", login);

router.post('/publickey',searchPublicKeyByCode);




// Get user
router.route('/getUserbyUserId/:publickey').get(getUserbyUserId);

// Update user
router.route('/updateUserbyuserId/:publickey').put(updateUserbyuserId);
router.route('/check').post(checkCode);
router.route('/getPlayerPosition/:publicKey').get(getPlayerPos);


export default router;