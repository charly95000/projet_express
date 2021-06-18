const express = require('express');
const router = express.Router();
const auth = require('../security/auth')
const multer = require('../config/multer-config')

const userCtrl = require('../controllers/user-ctrl')

router.post('/inscription',multer,userCtrl.signup)
router.post('/connexion',userCtrl.login)
router.get('/all',auth,userCtrl.getAllUsers)
router.get('/one/:userId',userCtrl.getUser)
router.delete('/one/:userId',userCtrl.deleteUser)
router.patch('/addFriend/:userId',auth, userCtrl.addFriend)
router.patch('/removeFriend/:userId', userCtrl.removeFriend)
router.patch('/updateCompte/:userId', userCtrl.updateUser)

module.exports = router;