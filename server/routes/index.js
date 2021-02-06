const { Router } = require("express")
const router = Router()
const loginController = require('../controllers/login')
const createChannelController = require('../controllers/createChannel')
const setChannelDescriptionController = require('../controllers/setChannelDescription')

router.post('/login', loginController.createToken)
router.post('/auth/github/upgrade', loginController.upgradeAccess)
router.post('/sso', loginController.sso)
router.get("/logout", loginController.logout);
router.post('/createChannel', createChannelController)
router.post('/setChannelDescription', setChannelDescriptionController)

module.exports = router;