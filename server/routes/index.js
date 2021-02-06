const { Router } = require("express")
const router = Router()
const loginController = require('../controllers/login')
const createChannelController = require('../controllers/createChannel')

router.post('/login', loginController.createToken)
router.post('/auth/github/upgrade', loginController.upgradeAccess)
router.post('/sso', loginController.sso)
router.get("/logout", loginController.logout);
router.post('/createChannel', createChannelController)

module.exports = router;