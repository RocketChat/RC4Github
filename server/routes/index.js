const { Router } = require("express")
const router = Router()
const loginController = require('../controllers/login')
const createChannelController = require('../controllers/createChannel')
const setChannelDescriptionController = require('../controllers/setChannelDescription')
const userInfoController = require('../controllers/userInfo')

router.post('/login', loginController.createToken)
router.post('/auth/github/upgrade', loginController.upgradeAccess)
router.post('/sso', loginController.sso)
router.post('/createChannel', createChannelController)
router.post('/setChannelDescription', setChannelDescriptionController)
router.get('/userInfo', userInfoController)

module.exports = router;