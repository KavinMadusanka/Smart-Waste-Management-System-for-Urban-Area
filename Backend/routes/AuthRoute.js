import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/AuthMiddleware.js'
import { registerController } from '../controllers/AuthController.js'

//router object
const router = express.Router()

//routing path
//Register || post method
router.post('/Register',registerController )

export default router