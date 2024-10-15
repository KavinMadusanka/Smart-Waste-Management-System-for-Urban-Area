import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/AuthMiddleware.js'
import { getAllWasteCollectors, LoginController, userRegisterController, wasteCollectorRegisterController, updateUserPoints, getSingleUser } from '../controllers/AuthController.js'

//router object
const router = express.Router()

//routing path
//get all waste collectors
router.get('/get-all-collectors',getAllWasteCollectors )

//user registration
router.post('/registerUser',userRegisterController)

//waste collector registration
router.post('/registerCollector',wasteCollectorRegisterController)

//login
router.post('/login',LoginController)

// Update user points
router.put('/update-points/:email', updateUserPoints);

//get single user
router.get('/get-SingleUser/:email',getSingleUser);

export default router