const { Router } = require("express")
const router = Router()
const loginController = require('../controllers/login')

router.get('/auth/github/callback', loginController.createToken)

module.exports = router;