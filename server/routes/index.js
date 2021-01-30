const { Router } = require("express")
const router = Router()
const loginController = require('../controllers/login')

router.post('/login', loginController.createToken)
router.post('/auth/github/upgrade', loginController.upgradeAccess)
router.post('/sso', loginController.sso)

module.exports = router;