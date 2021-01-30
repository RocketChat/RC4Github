const { Router } = require("express")
const router = Router()
const loginController = require('../controllers/login')
const createChannelController = require('../controllers/createChannel')
const userInfoController = require('../controllers/userInfo')

router.post('/login', loginController.createToken)
router.post('/auth/github/upgrade', loginController.upgradeAccess)
router.post('/createChannel', createChannelController)
router.get('/userInfo', userInfoController)

module.exports = router;